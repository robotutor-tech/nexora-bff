export type Premises = {
  premisesId: string
  name: string
  address: {
    street: string
    city: string
    state: string
    country: string
    postalCode: string
  }
  createdAt: Date
  updatedAt: Date
}
