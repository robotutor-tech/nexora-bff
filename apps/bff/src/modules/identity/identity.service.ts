import { Request, Response } from 'express'
import { Injectable } from '@nestjs/common'
import { ApiConfig, Webclient } from '@shared'
import { AuthenticationResponse, Tokens, ValidatedResponse } from './types/tokens'
import { AUTHORIZATION_HEADER } from '@shared/service/requestContext.service'

@Injectable()
export class IdentityService {
  // eslint-disable-next-line no-process-env
  private readonly isProduction = process.env.NODE_ENV === 'production'
  private readonly identityConfig = ApiConfig.identity

  constructor(private readonly webclient: Webclient) {}

  async authenticateUserAccount(request: Request, response: Response): Promise<AuthenticationResponse> {
    const tokens = await this.webclient.post<Tokens>({
      path: request.originalUrl,
      body: request.body as Record<string, unknown>
    })
    return this.setTokensInCookie(response, tokens)
  }

  async validate(request: Request, response: Response): Promise<ValidatedResponse> {
    const accessToken = request.cookies.accessToken as string | undefined
    if (!accessToken) {
      const refreshToken = request.cookies.refresh_token as string | undefined
      const tokens = await this.webclient.get<Tokens>({
        path: this.identityConfig.refresh,
        headers: { [AUTHORIZATION_HEADER]: `Bearer ${refreshToken}` }
      })
      this.setTokensInCookie(response, tokens)
      return this.webclient.get<ValidatedResponse>({
        path: request.originalUrl,
        headers: { [AUTHORIZATION_HEADER]: `Bearer ${tokens.accessToken}` }
      })
    }
    return this.webclient.get<ValidatedResponse>({ path: request.originalUrl })
  }

  private setTokensInCookie(response: Response, tokens: Tokens): AuthenticationResponse {
    response.cookie('access_token', tokens.accessToken, {
      httpOnly: true,
      secure: this.isProduction,
      sameSite: 'lax',
      expires: new Date(this.getTokenExpiry(tokens.accessToken) * 1000)
    })
    response.cookie('refresh_token', tokens.refreshToken, {
      httpOnly: true,
      secure: this.isProduction,
      sameSite: 'lax',
      expires: new Date(this.getTokenExpiry(tokens.refreshToken) * 1000)
    })
    return { status: 'SUCCESS' }
  }

  private getTokenExpiry(token: string): number {
    const text = Buffer.from(token.split('.')[1], 'base64url').toString('utf-8')
    const payload = JSON.parse(text) as { exp: number }
    return payload.exp
  }
}
