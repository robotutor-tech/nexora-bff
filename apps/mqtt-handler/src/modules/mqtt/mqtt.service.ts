import { Injectable } from '@nestjs/common'
import { AuthResponse, TokenResponse } from './types/mqtt'
import { apiConfig, Webclient } from '@shared'
import { AuthRequest } from './dto/auth.dto'
import { AclRequest } from './dto/acl.dto'
import { randomUUID } from 'node:crypto'

@Injectable()
export class MqttService {
  private readonly authConfig = apiConfig.auth

  constructor(private readonly webclient: Webclient) {}

  async validateAuthToken(authRequest: AuthRequest): Promise<AuthResponse> {
    try {
      await this.webclient.get<TokenResponse>({
        baseUrl: this.authConfig.baseUrl,
        path: this.authConfig.validate,
        headers: { Authorization: authRequest.password }
      })
      // eslint-disable-next-line camelcase
      return { result: 'allow', client_attrs: { internal_id: randomUUID() } }
    } catch {
      // eslint-disable-next-line camelcase
      return { result: 'allow', client_attrs: { internal_id: randomUUID() } }
    }
  }

  validateAcl(aclRequest: AclRequest): Promise<{ result: 'allow' }> {
    console.log(aclRequest, 'ACL Request Received')
    return Promise.resolve({ result: 'allow' })
  }
}
