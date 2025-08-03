import { Injectable } from '@nestjs/common'
import { Feed } from './types/feed'
import { apiConfig, Webclient } from '@shared'

@Injectable()
export class FeedsService {
  private readonly feedConfig = apiConfig.feed

  constructor(private readonly webclient: Webclient) {}

  getAllFeeds(): Promise<Feed[]> {
    return this.webclient.get<Feed[]>({ baseUrl: this.feedConfig.baseUrl, path: '' })
  }
}
