import { Injectable } from '@nestjs/common'
import { apiConfig, Webclient } from '@shared'
import { Actor } from '@shared/cache/cache'
import { TokenResponse } from './types/auth'
import { AuthenticateActorRequest } from './dto/authenticate-actor.dto'

@Injectable()
export class ActorService {
  private readonly identityConfig = apiConfig.identity

  constructor(private readonly webclient: Webclient) {}

  getCurrentActor(): Promise<Actor> {
    return this.webclient.get<Actor>({ baseUrl: this.identityConfig.baseUrl, path: this.identityConfig.actor })
  }

  async registerDeviceActor(deviceId: string, premisesId: string): Promise<Actor> {
    return this.webclient.post<Actor>({
      baseUrl: this.identityConfig.baseUrl,
      path: this.identityConfig.machineActor,
      body: { deviceId, premisesId }
    })
  }

  authenticate(authenticateActorRequest: AuthenticateActorRequest): Promise<TokenResponse> {
    return this.webclient.post<TokenResponse>({
      baseUrl: this.identityConfig.baseUrl,
      path: this.identityConfig.authenticateActor,
      body: authenticateActorRequest
    })
  }
}
