import { CreateDeviceInvitationSchema } from './createDeviceInvitation.schema'

describe('CreateDeviceInvitationSchema', () => {
  const valid = { name: 'Sensor', zoneId: 'z-1' }

  it('should pass for a valid payload', () => {
    const result = CreateDeviceInvitationSchema.safeParse(valid)
    expect(result.success).toBeTruthy()
    expect(result.data).toEqual(valid)
  })

  it('should fail when name is shorter than 4 chars (NameSchema)', () => {
    const data = { ...valid, name: 'Abc' }
    const result = CreateDeviceInvitationSchema.safeParse(data)
    expect(result.success).toBeFalsy()
    const issue = result.error!.issues.find(iss => iss.path.join('.') === 'name')
    expect(issue?.message).toStrictEqual('Name should not be less than 4 characters')
  })

  it('should fail when name is longer than 30 chars (NameSchema)', () => {
    const data = { ...valid, name: 'A'.repeat(31) }
    const result = CreateDeviceInvitationSchema.safeParse(data)
    expect(result.success).toBeFalsy()
    const issue = result.error!.issues.find(iss => iss.path.join('.') === 'name')
    expect(issue?.message).toStrictEqual('Name should not be more than 30 characters')
  })

  it('should fail when zoneId is not a string', () => {
    const data = { ...valid, zoneId: 1 as unknown as string }
    const result = CreateDeviceInvitationSchema.safeParse(data)
    expect(result.success).toBeFalsy()
    const issue = result.error!.issues.find(iss => iss.path.join('.') === 'zoneId')
    expect(issue?.code).toBe('invalid_type')
  })

  it('should fail when extra keys are present due to strict()', () => {
    const data = { ...valid, extra: 'nope' }
    const result = CreateDeviceInvitationSchema.safeParse(data)
    expect(result.success).toBeFalsy()
    const unrec = result.error!.issues.find(iss => iss.code === 'unrecognized_keys')
    expect(unrec).toBeTruthy()
    expect(unrec?.keys).toContain('extra')
  })
})

