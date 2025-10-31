import { Controller } from '@nestjs/common'
import { MessagePattern, Transport } from '@nestjs/microservices'
import type { FeedValueOut } from './types/bridge'
import { MqttClient } from '@shared/mqtt/mqtt.client'

@Controller()
export class DownlinkBridge {
  constructor(private readonly mqttClient: MqttClient) {}

  @MessagePattern('feed.value.updated', Transport.KAFKA)
  updateFeedValue({ feedId, value }: FeedValueOut): void {
    this.mqttClient.publish(`server/feed/${feedId}/value`, { value: value, feedId })
  }

  @MessagePattern('auth.invitation.accepted', Transport.KAFKA)
  invitationAccepted({ invitationId }: { invitationId: string }): void {
    this.mqttClient.publish(`web/invitation/${invitationId}/status`, { status: 'ACCEPTED', invitationId })
  }
}
