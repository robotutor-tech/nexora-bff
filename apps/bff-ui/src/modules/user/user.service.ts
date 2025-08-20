import { Injectable } from '@nestjs/common'
import { User } from './types/user'
import { RegisterUserRequest } from './dto/register-user.dto'
import { apiConfig, Webclient } from '@shared'

@Injectable()
export class UserService {
  private readonly userConfig = apiConfig.user

  constructor(private readonly webclient: Webclient) {}

  registerUser(userRequest: RegisterUserRequest): Promise<User> {
    return this.webclient.post<User>({
      baseUrl: this.userConfig.baseUrl,
      path: '',
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
