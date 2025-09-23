import { Injectable } from '@nestjs/common'
import { apiConfig, Webclient } from '@shared'
import { AuthenticationRequest } from '../../dto/authenticationDto'
import { Actor, ActorData, Device, User } from '@shared/cache/cache'

@Injectable()
export class ActorDataRetriever {
  private readonly actorConfig = apiConfig.actor
  private readonly userConfig = apiConfig.user
  private readonly deviceConfig = apiConfig.device

  constructor(private readonly webclient: Webclient) {}

  async retrieve(authRequest: AuthenticationRequest): Promise<ActorData> {
    const actor = await this.webclient.get<Actor>({
      baseUrl: this.actorConfig.baseUrl,
      path: this.actorConfig.me,
      headers: { Authorization: authRequest.password }
    })
    const principalData = await this.getPrincipalData(actor, authRequest)
    return {
      ...actor,
      principal: principalData
    } as ActorData
  }

  private async getPrincipalData(actor: Actor, authRequest: AuthenticationRequest): Promise<User | Device> {
    if (actor.principalType === 'USER') {
      return this.webclient.get<User>({
        baseUrl: this.userConfig.baseUrl,
        path: this.userConfig.me,
        headers: { Authorization: authRequest.password }
      })
    }
    return this.webclient.get<Device>({
      baseUrl: this.deviceConfig.baseUrl,
      path: this.deviceConfig.me,
      headers: { Authorization: authRequest.password }
    })
  }
}
