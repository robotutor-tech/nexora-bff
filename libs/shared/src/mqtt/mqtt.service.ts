import { ContextIdFactory, DiscoveryService, MetadataScanner, ModuleRef } from '@nestjs/core'
import { MqttClient } from '@shared/mqtt/mqtt.client'
import { MQTT_SUBSCRIBE } from '@shared/mqtt/mqtt.decorator'
import { ArgumentMetadata, Injectable, Logger, OnModuleInit, PipeTransform, Type } from '@nestjs/common'
import { PIPES_METADATA } from '@nestjs/common/constants'
import { randomUUID } from 'node:crypto'
import { CacheService } from '@shared/cache/cache.service'
import { MqttCallback, MqttPayload } from '@shared/mqtt/mqtt'
import { CacheData } from '@shared/cache/cache'

type RequestContextId = ReturnType<typeof ContextIdFactory.create>

@Injectable()
export class MqttSubscriberExplorer implements OnModuleInit {
  private readonly logger = new Logger(this.constructor.name)

  // eslint-disable-next-line max-params
  constructor(
    private readonly discoveryService: DiscoveryService,
    private readonly metadataScanner: MetadataScanner,
    private readonly moduleRef: ModuleRef,
    private readonly mqttClient: MqttClient,
    private readonly cacheService: CacheService
  ) {}

  onModuleInit(): void {
    const controllers = this.discoveryService.getControllers()
    controllers.forEach(wrapper => {
      const instance = (wrapper as { instance: object | null }).instance
      const maybeMetatype = (wrapper as { metatype: unknown }).metatype

      let proto: object | undefined
      if (typeof maybeMetatype === 'function') {
        proto = (maybeMetatype as { prototype: object }).prototype
      }

      const targetObj: object | undefined = instance ?? proto ?? undefined
      if (!targetObj) {
        return
      }

      this.metadataScanner.getAllMethodNames(targetObj).forEach(methodName => {
        const candidate = (targetObj as Record<string, unknown>)[methodName as keyof object]
        if (typeof candidate !== 'function') {
          return
        }
        const method = candidate as MqttCallback

        const topic = Reflect.getMetadata(MQTT_SUBSCRIBE, method) as string | undefined
        if (!topic) {
          return
        }

        this.mqttClient.subscribe(topic, async data => {
          await this.onMqtt(method, instance, maybeMetatype, data)
        })
      })
    })
  }

  private async onMqtt(
    method: MqttCallback,
    instance: object | null,
    metatype: unknown,
    data: MqttPayload
  ): Promise<void> {
    try {
      const controllerType = this.resolveControllerType(instance, metatype)
      if (!controllerType) {
        return
      }

      const contextId = await this.createMessageContext(data)

      const controllerInstance = await this.resolveController(controllerType, contextId)
      const parsedPayload = await this.transformPayload(controllerInstance as object, method, contextId, data.payload)
      await this.invokeHandler(controllerInstance, method, data, parsedPayload)
    } catch (error) {
      this.logger.error(`Error handling MQTT message for topic ${data.topic}`, error)
    }
  }

  private async createMessageContext(data: MqttPayload): Promise<RequestContextId> {
    const contextId = ContextIdFactory.create()
    const requestLike = await this.buildMqttRequestObject(data)
    this.moduleRef.registerRequestByContextId(requestLike, contextId)

    return contextId
  }

  private async buildMqttRequestObject(data: MqttPayload): Promise<{ headers: Record<string, string> }> {
    const cacheData = await this.cacheService.get<CacheData>(data.clientId)
    return {
      headers: {
        authorization: cacheData?.authorization ?? '',
        'x-trace-id': randomUUID()
      }
    }
  }

  private resolveControllerType(instance: object | null, metatype: unknown): Type<unknown> | null {
    if (typeof metatype === 'function') {
      return metatype as Type<unknown>
    }
    if (instance) {
      const ctor = (instance as { constructor: unknown }).constructor
      if (typeof ctor === 'function') {
        return ctor as Type<unknown>
      }
    }
    return null
  }

  private async resolveController(type: Type<unknown>, contextId: RequestContextId): Promise<unknown> {
    return this.moduleRef.resolve(type, contextId, { strict: false })
  }

  private async transformPayload(
    controllerInstance: object,
    method: MqttCallback,
    contextId: RequestContextId,
    payload: unknown
  ): Promise<unknown> {
    const pipes = await this.resolvePipes(controllerInstance, method, contextId)
    return this.applyPipes(pipes, payload)
  }

  private invokeHandler(
    controllerInstance: unknown,
    method: MqttCallback,
    data: MqttPayload,
    parsedPayload: unknown
  ): Promise<void> {
    return Reflect.apply(method, controllerInstance, [{ ...data, payload: parsedPayload }])
  }

  private async applyPipes(pipes: PipeTransform[], value: unknown): Promise<unknown> {
    let val = value
    const metadata: ArgumentMetadata = { type: 'body', metatype: undefined, data: undefined }
    for (const pipe of pipes) {
      val = await Promise.resolve(pipe.transform(val, metadata))
    }
    return val
  }

  // Resolve both class-level and method-level pipes in the given DI context
  private async resolvePipes(
    targetInstance: object,
    method: MqttCallback,
    contextId: RequestContextId
  ): Promise<PipeTransform[]> {
    const ctor = (targetInstance as { constructor: object }).constructor as Type<unknown>
    const classLevel = (Reflect.getMetadata(PIPES_METADATA, ctor) ?? []) as Array<PipeTransform | Type<PipeTransform>>
    const methodLevel = (Reflect.getMetadata(PIPES_METADATA, method) ?? []) as Array<
      PipeTransform | Type<PipeTransform>
    >
    const candidates: Array<PipeTransform | Type<PipeTransform>> = [...classLevel, ...methodLevel]

    const result: PipeTransform[] = []
    for (const candidate of candidates) {
      const resolved = await this.resolvePipeCandidate(candidate, contextId)
      if (resolved) {
        result.push(resolved)
      }
    }
    return result
  }

  private async resolvePipeCandidate(
    candidate: PipeTransform | Type<PipeTransform>,
    contextId: RequestContextId
  ): Promise<PipeTransform | null> {
    if (typeof candidate === 'function') {
      // Try to resolve from DI container (supports request-scoped providers)
      const resolved = await this.moduleRef.resolve(candidate, contextId, { strict: false }).catch(() => undefined)
      if (resolved && this.isPipe(resolved)) {
        return resolved
      }
      // Fallback to direct instantiation when not managed by Nest
      const created = new candidate()
      return this.isPipe(created) ? created : null
    }

    return this.isPipe(candidate) ? candidate : null
  }

  private isPipe(value: unknown): value is PipeTransform {
    return typeof value === 'object' && value !== null && typeof (value as PipeTransform).transform === 'function'
  }
}
