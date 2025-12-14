import { Injectable } from '@nestjs/common'
import { apiConfig, Webclient } from '@shared'
import { Actor } from '@shared/cache/cache'

@Injectable()
export class ActorService {
  private readonly iamConfig = apiConfig.iam

  constructor(private readonly webclient: Webclient) {}

  getCurrentActor(): Promise<Actor> {
    return this.webclient.get<Actor>({ baseUrl: this.iamConfig.baseUrl, path: this.iamConfig.actor })
  }
}
