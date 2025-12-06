import { Injectable } from '@nestjs/common'
import { TokenResponse, ValidatedUser } from './types/auth'
import { AuthenticateUserRequest } from './dto/authenticate-user.dto'
import { apiConfig, Webclient } from '@shared'
import { ActorLoginRequest } from './dto/actor-login.dto'
import { DeviceLoginRequest } from './dto/device-login.dto'

@Injectable()
export class IamService {
  private readonly iamConfig = apiConfig.iam

  constructor(private readonly webclient: Webclient) {}

  authenticateUser(authenticateUserRequest: AuthenticateUserRequest): Promise<TokenResponse> {
    return this.webclient.post<TokenResponse>({
      baseUrl: this.iamConfig.baseUrl,
      path: this.iamConfig.authenticate,
      body: { credentialId: authenticateUserRequest.email, secret: authenticateUserRequest.password, kind: 'PASSWORD' }
    })
  }

  validate(): Promise<ValidatedUser> {
    return this.webclient.get<ValidatedUser>({ baseUrl: this.iamConfig.baseUrl, path: this.iamConfig.validate })
  }

  deviceLogin(deviceLoginRequest: DeviceLoginRequest): Promise<TokenResponse> {
    return this.webclient.post<TokenResponse>({
      baseUrl: this.iamConfig.baseUrl,
      path: this.iamConfig.deviceLogin,
      body: deviceLoginRequest
    })
  }

  actorLogin(actorLoginRequest: ActorLoginRequest): Promise<TokenResponse> {
    return this.webclient.post<TokenResponse>({
      baseUrl: this.iamConfig.baseUrl,
      path: this.iamConfig.actorLogin,
      body: actorLoginRequest
    })
  }

  refresh(): Promise<TokenResponse> {
    return this.webclient.get<TokenResponse>({
      baseUrl: this.iamConfig.baseUrl,
      path: this.iamConfig.refresh
    })
  }
}
