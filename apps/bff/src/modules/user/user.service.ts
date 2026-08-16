import { Injectable } from '@nestjs/common'
import { RegisterUserRequest } from './dto/register-user.dto'
import { apiConfig, Webclient } from '@shared'
import { User } from '@shared/cache/cache'
import { Account } from '../identity/types/account'

@Injectable()
export class UserService {
  private readonly userConfig = apiConfig.user
  private readonly identityConfig = apiConfig.identity

  constructor(private readonly webclient: Webclient) {}

  async registerUser(userRequest: RegisterUserRequest): Promise<User> {
    const user = await this.webclient.post<User>({
      baseUrl: this.userConfig.baseUrl,
      path: this.userConfig.userRegister,
      body: userRequest
    })
    await this.webclient.post<Account>({
      baseUrl: this.identityConfig.baseUrl,
      path: this.identityConfig.accountRegister,
      body: {
        email: userRequest.email,
        password: userRequest.password,
        userId: user.userId
      }
    })
    return user
  }

  me(): Promise<User> {
    return this.webclient.get<User>({
      baseUrl: this.userConfig.baseUrl,
      path: this.userConfig.me
    })
  }
}
