import { Controller } from '@nestjs/common'
import { MqttMessage } from '@shared/mqtt/mqtt.decorator'

@Controller()
export class UplinkBridge {
  @MqttMessage('device/feed/+/value')
  updateFeedValue(topic: string, message: any, packet: any): void {
    console.log(topic, message, packet)
  }
}
