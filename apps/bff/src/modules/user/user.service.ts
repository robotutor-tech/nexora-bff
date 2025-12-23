import { Injectable } from '@nestjs/common'
import { RegisterUserRequest } from './dto/register-user.dto'
import { apiConfig, Webclient } from '@shared'
import { User } from '@shared/cache/cache'
import { Account } from '../iam/types/account'

@Injectable()
export class UserService {
  private readonly userConfig = apiConfig.user
  private readonly iamConfig = apiConfig.iam

  constructor(private readonly webclient: Webclient) {}

  async registerUser(userRequest: RegisterUserRequest): Promise<User> {
    const account = await this.webclient.post<Account>({
      baseUrl: this.iamConfig.baseUrl,
      path: this.iamConfig.accountRegister,
      body: { credentialId: userRequest.email, secret: userRequest.password, kind: 'PASSWORD', type: 'HUMAN' }
    })
    return this.webclient.post<User>({
      baseUrl: this.userConfig.baseUrl,
      path: this.userConfig.userRegister,
      body: { ...userRequest, accountId: account.accountId }
    })
  }

  me(): Promise<User> {
    return this.webclient.get<User>({
      baseUrl: this.userConfig.baseUrl,
      path: this.userConfig.me
    })
  }
}
