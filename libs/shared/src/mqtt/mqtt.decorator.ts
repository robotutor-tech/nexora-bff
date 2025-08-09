import { SetMetadata } from '@nestjs/common'

export const MQTT_SUBSCRIBE = 'MQTT_SUBSCRIBE'

export const MqttMessage = (topic: string): MethodDecorator => {
  return (target, propertyKey, descriptor: PropertyDescriptor) => {
    SetMetadata(MQTT_SUBSCRIBE, topic)(target, propertyKey, descriptor)
    return descriptor
  }
}
