import { Injectable } from '@nestjs/common'
import { BaseHandler } from './base.handler'
import { AuthenticationResponse } from '../types/mqtt'
import { AuthenticationRequest } from '../dto/authenticationDto'
import { apiConfig, Webclient } from '@shared'
import { UpdateCacheRequest } from './updateCache.handler'
import { ValidatedResponse } from '@shared/cache/cache'

@Injectable()
export class ActorAuthenticationHandler extends BaseHandler<
  AuthenticationRequest,
  AuthenticationResponse,
  UpdateCacheRequest
> {
  private readonly authConfig = apiConfig.iam
  constructor(private readonly webclient: Webclient) {
    super()
  }

  override async handle(authRequest: AuthenticationRequest): Promise<AuthenticationResponse> {
    try {
      const response = await this.webclient.get<ValidatedResponse>({
        baseUrl: this.authConfig.baseUrl,
        path: this.authConfig.validate,
        headers: { Authorization: authRequest.password }
      })
      await super.next({ response, authRequest })
      const clientAttributes = this.getClientAttributes(response)
      // eslint-disable-next-line camelcase
      return { result: 'allow', client_attrs: { internal_id: clientAttributes } }
    } catch {
      return { result: 'deny' }
    }
  }

  private getClientAttributes(validatedResponse: ValidatedResponse): string {
    if (validatedResponse.principalType === 'USER') {
      return `user/${validatedResponse.principal.userId}`
    }
    return `actor/${validatedResponse.principal.actorId}/role/${validatedResponse.principal.roleId}`
  }
}
