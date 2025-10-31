import { Injectable } from '@nestjs/common'
import { apiConfig, Webclient } from '@shared'
import { Actor } from '@shared/cache/cache'

@Injectable()
export class ActorService {
  private readonly actorConfig = apiConfig.actor

  constructor(private readonly webclient: Webclient) {}

  getCurrentActor(): Promise<Actor> {
    return this.webclient.get<Actor>({ baseUrl: this.actorConfig.baseUrl, path: this.actorConfig.me })
  }
}
