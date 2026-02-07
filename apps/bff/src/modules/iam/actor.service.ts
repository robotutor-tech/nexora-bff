import { Injectable } from '@nestjs/common'
import { apiConfig, Webclient } from '@shared'
import { Actor } from '@shared/cache/cache'
import { TokenResponse } from './types/auth'
import { AuthenticateActorRequest } from './dto/authenticate-actor.dto'

@Injectable()
export class ActorService {
  private readonly iamConfig = apiConfig.iam

  constructor(private readonly webclient: Webclient) {}

  getCurrentActor(): Promise<Actor> {
    return this.webclient.get<Actor>({ baseUrl: this.iamConfig.baseUrl, path: this.iamConfig.actor })
  }

  async registerDeviceActor(deviceId: string, premisesId: string): Promise<Actor> {
    return this.webclient.post<Actor>({
      baseUrl: this.iamConfig.baseUrl,
      path: this.iamConfig.machineActor,
      body: { deviceId, premisesId }
    })
  }

  authenticate(authenticateActorRequest: AuthenticateActorRequest): Promise<TokenResponse> {
    return this.webclient.post<TokenResponse>({
      baseUrl: this.iamConfig.baseUrl,
      path: this.iamConfig.authenticateActor,
      body: authenticateActorRequest
    })
  }
}
