import { Injectable } from '@nestjs/common'
import { TokenResponse, ValidatedUser } from './types/auth'
import { apiConfig, Webclient } from '@shared'
import { DeviceLoginRequest } from './dto/device-login.dto'

@Injectable()
export class IamService {
  private readonly iamConfig = apiConfig.iam

  constructor(private readonly webclient: Webclient) {}

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

  refresh(): Promise<TokenResponse> {
    return this.webclient.get<TokenResponse>({
      baseUrl: this.iamConfig.baseUrl,
      path: this.iamConfig.refresh
    })
  }
}
