import { Injectable } from '@nestjs/common'
import { apiConfig, Webclient } from '@shared'
import { DeviceCredentials } from './types/credentials'
import { TokenResponse } from './types/auth'
import { AuthenticateAccountRequest } from './dto/authenticate-account.dto'

@Injectable()
export class AccountService {
  private readonly iamConfig = apiConfig.iam

  constructor(private readonly webclient: Webclient) {}

  authenticate(request: AuthenticateAccountRequest): Promise<TokenResponse> {
    return this.webclient.post<TokenResponse>({
      baseUrl: this.iamConfig.baseUrl,
      path: this.iamConfig.authenticate,
      body: request
    })
  }

  rotateCredentials(principalId: string): Promise<DeviceCredentials> {
    return this.webclient.patch<DeviceCredentials>({
      baseUrl: this.iamConfig.baseUrl,
      path: this.iamConfig.credentialsRotate,
      uriVariables: { principalId }
    })
  }
}
