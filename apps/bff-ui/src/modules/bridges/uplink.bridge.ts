import { Controller } from '@nestjs/common'
import { KafkaService } from '@shared/kafka/kafka.service'
import { MqttMessage } from '@shared/mqtt/mqtt.decorator'
import type { MqttPayload } from '@shared/mqtt/mqtt'

@Controller()
export class UplinkBridge {
  constructor(private readonly kafkaService: KafkaService) {}

  @MqttMessage('web/feed/+/value')
  updateFeedValue({ topic, payload }: MqttPayload): void {
    console.log(topic, payload, '-----------------')
  }
}
