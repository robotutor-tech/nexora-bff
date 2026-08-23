import { Injectable } from '@nestjs/common'
import { ApiConfig, Webclient } from '@shared'
import { AuthenticationRequest } from '../../dto/authenticationDto'
import { Actor, ActorData, Device, User } from '@shared/cache/cache'

@Injectable()
export class ActorDataRetriever {
  private readonly identityConfig = ApiConfig.identity
  private readonly userConfig = ApiConfig.user
  private readonly deviceConfig = ApiConfig.device

  constructor(private readonly webclient: Webclient) {}

  async retrieve(authRequest: AuthenticationRequest): Promise<ActorData> {
    const actor = await this.webclient.get<Actor>({
      path: this.identityConfig.actor,
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
        path: this.userConfig.me,
        headers: { Authorization: authRequest.password }
      })
    }
    return this.webclient.get<Device>({
      path: this.deviceConfig.me,
      headers: { Authorization: authRequest.password }
    })
  }
}
