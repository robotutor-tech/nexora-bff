export type TokenResponse = {
  token: string
}

export type AuthResponse = {
  result: 'allow' | 'deny'
  client_attrs?: {
    internal_id: string
  }
}
