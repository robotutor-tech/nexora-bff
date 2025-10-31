import { Body, Controller, Get, Param, Patch } from '@nestjs/common'
import { FeedsService } from './feeds.service'
import { Feed } from './types/feed'
import { ZodValidationPipe } from '@shared'
import { FeedValueSchema } from './schema/feedValue.schema'
import { FeedValueDto } from './dto/feedValueRequest.dto'
import { MqttMessage } from '@shared/mqtt/mqtt.decorator'
import type { MqttPayload } from '@shared/mqtt/mqtt'

@Controller('feeds')
export class FeedsController {
  constructor(private readonly feedsService: FeedsService) {}

  @Get()
  getAllFeeds(): Promise<Feed[]> {
    return this.feedsService.getAllFeeds()
  }

  @Patch(':feedId/value')
  updateValue(
    @Param('feedId') feedId: string,
    @Body(new ZodValidationPipe(FeedValueSchema)) feedValueDto: FeedValueDto
  ): Promise<Feed> {
    return this.feedsService.updateValue(feedId, feedValueDto)
  }

  @MqttMessage('client/feed/+/value')
  updateFeed(@Body(new ZodValidationPipe(FeedValueSchema)) data: MqttPayload<{ value: number }>): void {
    const feedId = data.topic.split('/')[2]
    console.log(data, '--------------------', feedId)
    // this.mqttClient.publish(`web/invitation/${invitationId}/status`, { status: 'ACCEPTED', invitationId })
  }
}
