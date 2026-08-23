import type { Request, Response } from 'express'
import { Injectable } from '@nestjs/common'
import { ApiConfig, Webclient } from '@shared'
import { AuthenticationResponse, Tokens } from './types/tokens'

@Injectable()
export class IdentityService {
  // eslint-disable-next-line no-process-env
  private readonly isProduction = process.env.NODE_ENV === 'production'
  private readonly identityConfig = ApiConfig.identity

  constructor(private readonly webclient: Webclient) {}

  async refresh(request: Request, response: Response): Promise<AuthenticationResponse> {
    const tokens = await this.webclient.get<Tokens>({
      path: this.identityConfig.refresh
    })
    return this.setTokensInCookie(response, tokens)
  }

  async authenticateUserAccount(request: Request, response: Response): Promise<AuthenticationResponse> {
    const tokens = await this.webclient.post<Tokens>({
      path: request.originalUrl,
      body: request.body as Record<string, unknown>
    })
    return this.setTokensInCookie(response, tokens)
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
