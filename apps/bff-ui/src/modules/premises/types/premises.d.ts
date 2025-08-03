export type Premises = {
  premisesId: string
  name: string
  createdAt: Date
}

export type PremisesWithActors = Premises & { actor: ActorView[] }

export type ActorView = {
  actorId: string
  premisesId: string
  identifier: { id: string; type: 'USER' }
  state: 'ACTIVE' | 'INACTIVE'
  roles: Role[]
}

export type Role = {
  roleId: string
  name: string
}

