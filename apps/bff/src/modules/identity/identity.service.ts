import { Injectable } from '@nestjs/common'
import { TokenResponse, ValidatedUser } from './types/auth'
import { apiConfig, Webclient } from '@shared'
import { DeviceLoginRequest } from './dto/device-login.dto'

@Injectable()
export class identityService {
  private readonly identityConfig = apiConfig.identity

  constructor(private readonly webclient: Webclient) {}

  validate(): Promise<ValidatedUser> {
    return this.webclient.get<ValidatedUser>({ baseUrl: this.identityConfig.baseUrl, path: this.identityConfig.validate })
  }

  deviceLogin(deviceLoginRequest: DeviceLoginRequest): Promise<TokenResponse> {
    return this.webclient.post<TokenResponse>({
      baseUrl: this.identityConfig.baseUrl,
      path: this.identityConfig.deviceLogin,
      body: deviceLoginRequest
    })
  }

  refresh(): Promise<TokenResponse> {
    return this.webclient.get<TokenResponse>({
      baseUrl: this.identityConfig.baseUrl,
      path: this.identityConfig.refresh
    })
  }
}
