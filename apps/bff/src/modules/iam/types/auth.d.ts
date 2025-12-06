export type TokenResponse = {
  token: string
  refreshToken: string
}

export type ValidatedUser<T extends PrincipalType = PrincipalType> = {
  isValid: boolean
  principalType: T
  principal: PrincipalMap[T]
  expiresIn: number
}

type PrincipalMap = {
  ACCOUNT: { accountId: string; type: 'HUMAN' | 'MACHINE' }
  ACTOR: { actorId: string; roleId: string }
}

export type PrincipalType = keyof PrincipalMap
