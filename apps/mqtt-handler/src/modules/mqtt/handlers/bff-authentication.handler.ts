import { Injectable } from '@nestjs/common'
import { BaseHandler } from './base.handler'
import { AuthenticationRequest } from '../dto/authenticationDto'
import { AuthenticationResponse } from '../types/mqtt'

@Injectable()
export class BFFAuthenticationHandler extends BaseHandler<AuthenticationRequest, AuthenticationResponse> {
  constructor() {
    super()
  }

  handle(authRequest: AuthenticationRequest): Promise<AuthenticationResponse> {
    if (
      (authRequest.password === 'BFF_IOT_PASSWORD' && authRequest.clientId === 'BFF-IOT') ||
      (authRequest.password === 'BFF_UI_PASSWORD' && authRequest.clientId === 'BFF-UI')
    ) {
      return Promise.resolve({
        result: 'allow',
        // eslint-disable-next-line camelcase
        client_attrs: { internal_id: authRequest.clientId }
      })
    }
    return super.next(authRequest)
  }
}
