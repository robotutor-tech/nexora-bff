export type Tokens = {
  accessToken: string
  expiresIn: number
  refreshToken: string
  expiresInSecret: string
}

export type AuthenticationResponse = { status: 'SUCCESS' | 'ERROR' }
