import { Controller } from '@nestjs/common'
import { MessagePattern, Transport } from '@nestjs/microservices'
import type { FeedValueOut } from './types/bridge'
import { MqttClient } from '@shared/mqtt/mqtt.client'

@Controller()
export class DownlinkBridge {
  constructor(private readonly mqttClient: MqttClient) {}

  @MessagePattern('out.feed.update', Transport.KAFKA)
  updateFeedValue({ feedId, value }: FeedValueOut): void {
    this.mqttClient.publish(`feed/${feedId}/value`, { value: value })
  }
}
