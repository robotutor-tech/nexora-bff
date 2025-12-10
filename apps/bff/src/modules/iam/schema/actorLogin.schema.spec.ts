import { AuthenticateActorSchema } from './authenticateActorSchema'

describe('ActorLoginSchema', () => {
  const valid = { actorId: 'a-1', roleId: 'r-1' }

  it('should pass for a valid payload', () => {
    const result = AuthenticateActorSchema.safeParse(valid)
    expect(result.success).toBeTruthy()
    expect(result.data).toEqual(valid)
  })

  it('should fail when actorId is not a string', () => {
    const data = { ...valid, actorId: 123 as unknown as string }
    const result = AuthenticateActorSchema.safeParse(data)
    expect(result.success).toBeFalsy()
    const issue = result.error!.issues.find(iss => iss.path.join('.') === 'actorId')
    expect(issue?.code).toBe('invalid_type')
  })

  it('should fail when roleId is not a string', () => {
    const data = { ...valid, roleId: null as unknown as string }
    const result = AuthenticateActorSchema.safeParse(data)
    expect(result.success).toBeFalsy()
    const issue = result.error!.issues.find(iss => iss.path.join('.') === 'roleId')
    expect(issue?.code).toBe('invalid_type')
  })

  it('should fail when extra keys are present due to strict()', () => {
    const data = { ...valid, extra: 'nope' }
    const result = AuthenticateActorSchema.safeParse(data)
    expect(result.success).toBeFalsy()
    const unrec = result.error!.issues.find(iss => iss.code === 'unrecognized_keys')
    expect(unrec).toBeTruthy()
    expect(unrec?.keys).toContain('extra')
  })
})

