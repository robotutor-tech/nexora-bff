import { Injectable } from '@nestjs/common'
import { RegisterUserRequest } from './dto/register-user.dto'
import { apiConfig, Webclient } from '@shared'
import { User } from '@shared/cache/cache'

@Injectable()
export class UserService {
  private readonly userConfig = apiConfig.user
  private readonly orchestrationConfig = apiConfig.orchestration

  constructor(private readonly webclient: Webclient) {}

  async registerUser(userRequest: RegisterUserRequest): Promise<User> {
    return this.webclient.post<User>({
      baseUrl: this.orchestrationConfig.baseUrl,
      path: this.orchestrationConfig.users,
      body: userRequest
    })
  }

  me(): Promise<User> {
    return this.webclient.get<User>({
      baseUrl: this.userConfig.baseUrl,
      path: this.userConfig.me
    })
  }
}
