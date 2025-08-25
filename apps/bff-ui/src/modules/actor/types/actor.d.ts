export type Actor = {
  actorId: string
  premisesId: string
  role: {
    roleId: string
    name: string
    roleType: RoleType
  }
}

type RoleType = 'OWNER' | 'ADMIN' | 'USER' | 'GUEST'
