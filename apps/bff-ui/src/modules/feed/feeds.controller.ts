import { Body, Controller, Get, Param, Patch } from '@nestjs/common'
import { FeedsService } from './feeds.service'
import { Feed } from './types/feed'
import { ZodValidationPipe } from '@shared'
import { FeedValueSchema } from './schema/feedValue.schema'
import { FeedValueDto } from './dto/feedValueRequest.dto'

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
}
