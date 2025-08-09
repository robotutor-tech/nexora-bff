import { DiscoveryService, MetadataScanner } from '@nestjs/core'
import { MqttClient } from '@shared/mqtt/mqtt.client'
import { MQTT_SUBSCRIBE } from '@shared/mqtt/mqtt.decorator'
import { Injectable, OnModuleInit } from '@nestjs/common'

@Injectable()
export class MqttSubscriberExplorer implements OnModuleInit {
  constructor(
    private readonly discoveryService: DiscoveryService,
    private readonly metadataScanner: MetadataScanner,
    private readonly mqttClient: MqttClient
  ) {}

  onModuleInit(): void {
    const controllers = this.discoveryService.getControllers()

    controllers.forEach(({ instance }) => {
      if (!instance) {
        return
      }

      this.metadataScanner.getAllMethodNames(instance).forEach(methodName => {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment,@typescript-eslint/no-unsafe-function-type
        const method: Function = instance[methodName]
        const topic = Reflect.getMetadata(MQTT_SUBSCRIBE, method) as string
        if (topic) {
          this.mqttClient.subscribe(topic, data => {
            method.call(instance, data)
          })
        }
      })
    })
  }
}
