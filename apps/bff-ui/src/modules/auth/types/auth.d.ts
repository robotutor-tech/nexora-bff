import type { Identifier } from '@/common/types/types'

export type AuthUser = {
  name: string
  email: string
  userId: string
  registeredAt: Date
}

export type TokenResponse = {
  token: string
}

export type ValidatedUser = {
  tokenIdentifier: Identifier<TokenIdentifier>
  actor?: { actorId: string; premisesId: string; actorIdentifier: Identifier<ActorIdentifier> }
}

export type TokenIdentifier = 'PREMISES_ACTOR' | 'AUTH_USER'
export type ActorIdentifier = 'HUMAN'

export type UpdateTokenRequest = { actorId: string; roleId: string }
