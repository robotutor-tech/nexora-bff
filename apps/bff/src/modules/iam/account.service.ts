import { Injectable } from '@nestjs/common'
import { apiConfig, Webclient } from '@shared'
import { DeviceCredentials } from './types/credentials'

@Injectable()
export class AccountService {
  private readonly iamConfig = apiConfig.iam

  constructor(private readonly webclient: Webclient) {}

  rotateCredentials(accountId: string): Promise<DeviceCredentials> {
    return this.webclient.patch<DeviceCredentials>({
      baseUrl: this.iamConfig.baseUrl,
      path: this.iamConfig.credentialsRotate,
      uriVariables: { accountId }
    })
  }
}
