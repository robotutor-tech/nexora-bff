import type { Document } from '@shared/types/types'

export type Tokens = {
  accessToken: string
  expiresIn: number
  refreshToken: string
  expiresInSecret: string
}

export type AuthenticationResponse = { status: 'SUCCESS' | 'ERROR' }

export type ValidatedResponse = {
  isValid: boolean
  principal: Document
  expiresIn: number
}
