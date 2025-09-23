import { AuthenticationSchema } from './authenticationSchema'

describe('AuthSchema', () => {
  const valid = { password: 'Bearer jwt' }

  it('should pass for a valid payload', () => {
    const result = AuthenticationSchema.safeParse(valid)
    expect(result.success).toBeTruthy()
    expect(result.data).toEqual(valid)
  })

  it('should fail when password is not a string', () => {
    const data = { ...valid, password: 123 as unknown as string }
    const result = AuthenticationSchema.safeParse(data)
    expect(result.success).toBeFalsy()
    const issue = result.error!.issues.find(iss => iss.path.join('.') === 'password')
    expect(issue?.code).toBe('invalid_type')
  })

  it('should fail when extra keys are present due to strict()', () => {
    const data = { ...valid, extra: 'nope' }
    const result = AuthenticationSchema.safeParse(data)
    expect(result.success).toBeFalsy()
    const unrec = result.error!.issues.find(iss => iss.code === 'unrecognized_keys')
    expect(unrec).toBeTruthy()
    expect(unrec?.keys).toContain('extra')
  })
})

