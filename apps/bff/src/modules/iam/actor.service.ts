import { Injectable } from '@nestjs/common'
import { apiConfig, Webclient } from '@shared'
import { Actor } from '@shared/cache/cache'
import { DeviceService } from '../device/device.service'
import { TokenResponse } from './types/auth'
import { AuthenticateActorRequest } from './dto/authenticate-actor.dto'

@Injectable()
export class ActorService {
  private readonly iamConfig = apiConfig.iam
  // private readonly orchestrationConfig = apiConfig.orchestration

  constructor(
    private readonly webclient: Webclient,
    private readonly devicesService: DeviceService
  ) {}

  getCurrentActor(): Promise<Actor> {
    return this.webclient.get<Actor>({ baseUrl: this.iamConfig.baseUrl, path: this.iamConfig.actor })
  }

  async registerDeviceActor(): Promise<Actor> {
    const device = await this.devicesService.getCurrentDevice()
    console.log(device, '-------------------')
    return this.webclient.post<Actor>({
      baseUrl: this.iamConfig.baseUrl,
      path: this.iamConfig.machineActor,
      body: { deviceId: device.deviceId, premisesId: device.premisesId }
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
