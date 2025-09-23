export type ValidatedResponse = { isValid: boolean; expiresAt: Date } & (
  | {
      principalType: 'USER'
      principal: { userId: string }
    }
  | {
      principalType: 'ACTOR'
      principal: { actorId: string; roleId: string }
    }
)

export type User = {
  name: string
  email: string
  mobile: string
  isEmailVerified: boolean
  isMobileVerified: boolean
  userId: string
  registeredAt: Date
}

export type Device = {
  deviceId: string
  premisesId: string
  name: string
  modelNo: string
  serialNo: string
  type: 'DEVICE' | 'LOCAL_SERVER' | 'SERVER'
  state: 'ACTIVE' | 'INACTIVE'
  health: 'OFFLINE' | 'ONLINE'
  os?: { name: string; version: string }
}

export type Actor = {
  actorId: string
  premisesId: string
  role: {
    roleId: string
    name: string
    roleType: RoleType
  }
} & (
  | { principalType: 'USER'; principal: { userId: string } }
  | { principalType: 'DEVICE'; principal: { deviceId: string } }
)

type RoleType = 'OWNER' | 'ADMIN' | 'USER' | 'GUEST'

export type ActorData = Actor &
  ({ principalType: 'USER'; principal: User } | { principalType: 'DEVICE'; principal: Device })

export type CacheData = { validatedResponse: ValidatedResponse; actorData: ActorData; authorization: string }
