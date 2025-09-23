export type AuthenticationResponse =
  | {
      result: 'allow'
      client_attrs: { internal_id: string }
    }
  | { result: 'deny' }

export type AuthorizationResponse = {
  result: 'allow' | 'deny'
}
