import { AclSchema } from './acl.schema'

describe('AclSchema', () => {
  const valid = { username: 'alice' }

  it('should pass for a valid payload', () => {
    const result = AclSchema.safeParse(valid)
    expect(result.success).toBeTruthy()
    expect(result.data).toEqual(valid)
  })

  it('should fail when username is not a string', () => {
    const data = { ...valid, username: 123 as unknown as string }
    const result = AclSchema.safeParse(data)
    expect(result.success).toBeFalsy()
    const issue = result.error!.issues.find(iss => iss.path.join('.') === 'username')
    expect(issue?.code).toBe('invalid_type')
  })

  it('should fail when extra keys are present due to strict()', () => {
    const data = { ...valid, extra: 'nope' }
    const result = AclSchema.safeParse(data)
    expect(result.success).toBeFalsy()
    const unrec = result.error!.issues.find(iss => iss.code === 'unrecognized_keys')
    expect(unrec).toBeTruthy()
    expect(unrec?.keys).toContain('extra')
  })
})

