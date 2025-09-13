import 'reflect-metadata'
import type { DiscoveryService, MetadataScanner } from '@nestjs/core'
import { MqttSubscriberExplorer } from './mqtt.service'
import { MqttClient } from './mqtt.client'
import { MqttMessage, MQTT_SUBSCRIBE } from './mqtt.decorator'

describe('MqttSubscriberExplorer', () => {
  class SampleController {
    handle = jest.fn()

    @MqttMessage('devices/+/status')
    onDeviceStatus(_msg: unknown): void {
      // will be replaced with a jest.fn in test
    }
  }

  let discoveryService: Pick<DiscoveryService, 'getControllers'>
  let metadataScanner: Pick<MetadataScanner, 'getAllMethodNames'>
  let mqttClient: Pick<MqttClient, 'subscribe'>

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should subscribe annotated controller methods and dispatch payload to the method', () => {
    const controller = new SampleController()

    // Replace method with mock and re-attach metadata so explorer can find it
    const handlerMock = jest.fn()
    ;(controller as any).onDeviceStatus = handlerMock
    Reflect.defineMetadata(MQTT_SUBSCRIBE, 'devices/+/status', handlerMock)

    discoveryService = {
      getControllers: () => [{ instance: controller } as any, { instance: undefined } as any]
    }

    metadataScanner = {
      getAllMethodNames: () => ['handle', 'onDeviceStatus']
    }

    const subscribeMock = jest.fn()
    mqttClient = { subscribe: subscribeMock }

    const explorer = new MqttSubscriberExplorer(
      discoveryService as DiscoveryService,
      metadataScanner as unknown as MetadataScanner,
      mqttClient as unknown as MqttClient
    )

    explorer.onModuleInit()

    // Should subscribe only the annotated method
    expect(subscribeMock).toHaveBeenCalledTimes(1)
    const [topic, callback] = (subscribeMock as jest.Mock).mock.calls[0] as [string, (data: unknown) => void]
    expect(topic).toBe('devices/+/status')

    // Simulate message delivery and verify controller method invoked
    const payload = { ok: true }
    callback({ topic: 'devices/abc/status', payload })
    expect(handlerMock).toHaveBeenCalledTimes(1)
    expect(handlerMock).toHaveBeenCalledWith({ topic: 'devices/abc/status', payload })
  })

  it('should ignore controllers without annotated methods', () => {
    class NoAnnotationController {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      foo(_arg: unknown): void {}
    }

    const controller = new NoAnnotationController()

    discoveryService = { getControllers: () => [{ instance: controller } as any] }
    metadataScanner = { getAllMethodNames: () => ['foo'] }

    const subscribeMock = jest.fn()
    mqttClient = { subscribe: subscribeMock }

    const explorer = new MqttSubscriberExplorer(
      discoveryService as DiscoveryService,
      metadataScanner as unknown as MetadataScanner,
      mqttClient as unknown as MqttClient
    )

    explorer.onModuleInit()

    expect(subscribeMock).not.toHaveBeenCalled()
  })
})
