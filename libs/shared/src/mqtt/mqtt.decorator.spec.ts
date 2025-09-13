import 'reflect-metadata'
import { MqttMessage, MQTT_SUBSCRIBE } from './mqtt.decorator'

describe('MqttMessage decorator', () => {
  it('should set MQTT_SUBSCRIBE metadata with provided topic on the method function', () => {
    class TestController {
      @MqttMessage('devices/+/status')
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      handle(_msg: unknown): void {}
    }

    const methodFn = TestController.prototype.handle
    const topic = Reflect.getMetadata(MQTT_SUBSCRIBE, methodFn) as string
    expect(topic).toBe('devices/+/status')
  })
})

