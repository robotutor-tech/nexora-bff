import { Controller, Get } from '@nestjs/common'
import { FeedsService } from './feeds.service'
import { Feed } from './types/feed'

@Controller('feeds')
export class FeedsController {
  constructor(private readonly feedsService: FeedsService) {}

  @Get()
  getAllFeeds(): Promise<Feed[]> {
    return this.feedsService.getAllFeeds()
  }
}
