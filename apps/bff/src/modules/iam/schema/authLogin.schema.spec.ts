import { AuthenticateUserSchema } from './authenticateUserSchema'

describe('AuthLoginSchema', () => {
  const valid = { email: 'alice@example.com', password: 'Password1' }

  it('should pass for a valid payload', () => {
    const result = AuthenticateUserSchema.safeParse(valid)
    expect(result.success).toBeTruthy()
    expect(result.data).toEqual(valid)
  })

  it('should fail when email is invalid', () => {
    const data = { ...valid, email: 'not-an-email' }
    const result = AuthenticateUserSchema.safeParse(data)
    expect(result.success).toBeFalsy()
    const issue = result.error!.issues.find(iss => iss.path.join('.') === 'email')
    expect(issue?.message).toStrictEqual('Email should be valid')
  })

  it('should fail when password is shorter than 8 chars', () => {
    const data = { ...valid, password: 'Passw1' }
    const result = AuthenticateUserSchema.safeParse(data)
    expect(result.success).toBeFalsy()
    const issue = result.error!.issues.find(iss => iss.path.join('.') === 'password')
    expect(issue?.message).toStrictEqual('Name should not be less than 8 characters')
  })

  it('should fail when password is longer than 20 chars', () => {
    const data = { ...valid, password: 'A'.repeat(21) }
    const result = AuthenticateUserSchema.safeParse(data)
    expect(result.success).toBeFalsy()
    const issue = result.error!.issues.find(iss => iss.path.join('.') === 'password')
    expect(issue?.message).toStrictEqual('Name should not be more than 20 characters')
  })

  it('should fail when extra keys are present due to strict()', () => {
    const data = { ...valid, extra: 'nope' }
    const result = AuthenticateUserSchema.safeParse(data)
    expect(result.success).toBeFalsy()
    const unrec = result.error!.issues.find(iss => iss.code === 'unrecognized_keys')
    expect(unrec).toBeTruthy()
    expect(unrec?.keys).toContain('extra')
  })
})

