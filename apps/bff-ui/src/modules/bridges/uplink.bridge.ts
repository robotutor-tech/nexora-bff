import { Controller } from '@nestjs/common'
import { KafkaService } from '@shared/kafka/kafka.service'
import { MqttMessage } from '@shared/mqtt/mqtt.decorator'
import type { MqttPayload } from '@shared/mqtt/mqtt'
import { MqttClient } from '@shared/mqtt/mqtt.client'

@Controller()
export class UplinkBridge {
  constructor(private readonly kafkaService: KafkaService, private readonly mqttClient: MqttClient) {}

  @MqttMessage('web/feed/+')
  updateFeedValue({ topic, payload, clientId }: MqttPayload<{ value: number }>): void {
    const feedId = topic.split('/')[2]

    this.mqttClient.publish(`feed/${topic.split('/')[2]}/value`, { value: payload.value })
    // this.kafkaService.publish('bff.feed.feed-updated', clientId, {
    //   feedId: topic.split('/')[2],
    //   value: payload.value
    // })
  }
}
