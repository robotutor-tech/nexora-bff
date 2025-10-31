import { RegisterUserSchema } from './registerUser.schema'

describe('RegisterUserSchema', () => {
  const valid = {
    name: 'Alice Example',
    email: 'alice@example.com',
    password: 'Password1',
    mobile: '9123456789'
  }

  it('should pass for a valid payload', () => {
    const result = RegisterUserSchema.safeParse(valid)
    expect(result.success).toBeTruthy()
    expect(result.data).toEqual(valid)
  })

  it('should fail when name is shorter than 4 chars (NameSchema)', () => {
    const data = { ...valid, name: 'Alc' }
    const result = RegisterUserSchema.safeParse(data)
    expect(result.success).toBeFalsy()
    const issue = result.error!.issues.find(iss => iss.path.join('.') === 'name')
    expect(issue?.message).toStrictEqual('Name should not be less than 4 characters')
  })

  it('should fail when name is longer than 30 chars (NameSchema)', () => {
    const data = { ...valid, name: 'A'.repeat(31) }
    const result = RegisterUserSchema.safeParse(data)
    expect(result.success).toBeFalsy()
    const issue = result.error!.issues.find(iss => iss.path.join('.') === 'name')
    expect(issue?.message).toStrictEqual('Name should not be more than 30 characters')
  })

  it('should fail when email is invalid', () => {
    const data = { ...valid, email: 'not-an-email' }
    const result = RegisterUserSchema.safeParse(data)
    expect(result.success).toBeFalsy()
    const issue = result.error!.issues.find(iss => iss.path.join('.') === 'email')
    expect(issue?.message).toStrictEqual('Email should be valid')
  })

  it('should fail when password is shorter than 8 chars', () => {
    const data = { ...valid, password: 'Passw1' } // 6 chars
    const result = RegisterUserSchema.safeParse(data)
    expect(result.success).toBeFalsy()
    const issue = result.error!.issues.find(iss => iss.path.join('.') === 'password')
    expect(issue?.message).toStrictEqual('Name should not be less than 8 characters')
  })

  it('should fail when password is longer than 20 chars', () => {
    const data = { ...valid, password: 'Abcdefghijklmn12345AAA' }
    const result = RegisterUserSchema.safeParse(data)
    expect(result.success).toBeFalsy()
    const issue = result.error!.issues.find(iss => iss.path.join('.') === 'password')
    expect(issue?.message).toStrictEqual('Name should not be more than 20 characters')
  })

  it('should fail when password does not meet complexity rules', () => {
    const data = { ...valid, password: 'password' } // no uppercase, no digit
    const result = RegisterUserSchema.safeParse(data)
    expect(result.success).toBeFalsy()
    const issue = result.error!.issues.find(iss => iss.path.join('.') === 'password')
    expect(issue?.message).toStrictEqual(
      'Password must contain at least one uppercase letter, one lowercase letter, and one digit'
    )
  })

  it('should fail when mobile is not exactly 10 digits', () => {
    const data = { ...valid, mobile: '123456789' } // 9 digits
    const result = RegisterUserSchema.safeParse(data)
    expect(result.success).toBeFalsy()
    const issue = result.error!.issues.find(iss => iss.path.join('.') === 'mobile')
    expect(issue?.message).toStrictEqual('Mobile number must be exactly 10 digits')
  })

  it('should fail when extra keys are present due to strict()', () => {
    const data = { ...valid, extra: 'nope' }
    const result = RegisterUserSchema.safeParse(data)
    expect(result.success).toBeFalsy()
    const unrec = result.error!.issues.find(iss => iss.code === 'unrecognized_keys')
    expect(unrec).toBeTruthy()
    expect(unrec?.keys).toContain('extra')
  })
})
