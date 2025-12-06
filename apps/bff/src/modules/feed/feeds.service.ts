import { Injectable } from '@nestjs/common'
import { Feed } from './types/feed'
import { apiConfig, Webclient } from '@shared'
import { FeedValueRequest } from './dto/feedValueRequest.dto'

@Injectable()
export class FeedsService {
  private readonly feedConfig = apiConfig.feed

  constructor(private readonly webclient: Webclient) {}

  getAllFeeds(): Promise<Feed[]> {
    return this.webclient.get<Feed[]>({ baseUrl: this.feedConfig.baseUrl, path: this.feedConfig.feeds })
  }

  updateValue(feedId: string, feedValueRequest: FeedValueRequest): Promise<Feed> {
    return this.webclient.patch<Feed>({
      baseUrl: this.feedConfig.baseUrl,
      path: this.feedConfig.feedValue,
      uriVariables: { feedId },
      body: feedValueRequest
    })
  }
}
