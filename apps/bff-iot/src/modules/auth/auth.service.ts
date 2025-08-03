import { Injectable } from '@nestjs/common'
import { ValidatedUser } from './types/auth'
import { apiConfig, Webclient } from '@shared'

@Injectable()
export class AuthService {
  private readonly authConfig = apiConfig.auth

  constructor(private readonly webclient: Webclient) {}

  validate(): Promise<ValidatedUser> {
    return this.webclient.get<ValidatedUser>({ baseUrl: this.authConfig.baseUrl, path: this.authConfig.validate })
  }
}
