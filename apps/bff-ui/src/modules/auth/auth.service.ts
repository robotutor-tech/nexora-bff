import { Injectable } from '@nestjs/common'
import { TokenResponse, ValidatedUser } from './types/auth'
import { AuthLoginRequest } from './dto/auth-login.dto'
import { apiConfig, Webclient } from '@shared'
import { ActorLoginRequest } from './dto/actor-login.dto'

@Injectable()
export class AuthService {
  private readonly authConfig = apiConfig.auth

  constructor(private readonly webclient: Webclient) {}

  login(loginRequest: AuthLoginRequest): Promise<TokenResponse> {
    return this.webclient.post<TokenResponse>({
      baseUrl: this.authConfig.baseUrl,
      path: this.authConfig.login,
      body: loginRequest
    })
  }

  validate(): Promise<ValidatedUser> {
    return this.webclient.get<ValidatedUser>({ baseUrl: this.authConfig.baseUrl, path: this.authConfig.validate })
  }

  actorLogin(actorLoginRequest: ActorLoginRequest): Promise<TokenResponse> {
    return this.webclient.post<TokenResponse>({
      baseUrl: this.authConfig.baseUrl,
      path: this.authConfig.actorLogin,
      body: actorLoginRequest
    })
  }

  refresh(): Promise<TokenResponse> {
    return this.webclient.get<TokenResponse>({
      baseUrl: this.authConfig.baseUrl,
      path: this.authConfig.refresh
    })
  }
}
