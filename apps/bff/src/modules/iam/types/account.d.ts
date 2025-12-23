export type Account = {
  accountId: string
  type: 'HUMAN' | 'MACHINE'
  status: 'ACTIVE' | 'INACTIVE' | 'REGISTERED'
  createdAt: Date
  updatedAt: Date
}
