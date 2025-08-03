import { Injectable } from '@nestjs/common'
import { AuthUser, TokenResponse, UpdateTokenRequest, ValidatedUser } from './types/auth'
import { RegisterUserRequest } from './dto/create-user.dto'
import { AuthLoginRequest } from './dto/auth-login.dto'
import { apiConfig, Webclient } from '@shared'

@Injectable()
export class AuthService {
  private readonly orchestrationConfig = apiConfig.orchestration
  private readonly authConfig = apiConfig.auth

  constructor(private readonly webclient: Webclient) {}

  create(userRequest: RegisterUserRequest): Promise<AuthUser> {
    return this.webclient.post<AuthUser>({
      baseUrl: this.orchestrationConfig.baseUrl,
      path: this.orchestrationConfig.registerUser,
      body: userRequest
    })
  }

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

  updateToken(tokenRequest: UpdateTokenRequest): Promise<TokenResponse> {
    return this.webclient.post<TokenResponse>({
      baseUrl: this.authConfig.baseUrl,
      path: this.authConfig.token,
      body: tokenRequest
    })
  }
}
