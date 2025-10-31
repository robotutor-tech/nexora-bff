import { CreateZoneSchema } from './createZone.schema'

describe('CreateZoneSchema', () => {
  const valid = { name: 'Living Room' }

  it('should pass for a valid payload', () => {
    const result = CreateZoneSchema.safeParse(valid)
    expect(result.success).toBeTruthy()
    expect(result.data).toEqual(valid)
  })

  it('should fail when name is shorter than 4 chars (NameSchema)', () => {
    const data = { ...valid, name: 'Rum' }
    const result = CreateZoneSchema.safeParse(data)
    expect(result.success).toBeFalsy()
    const issue = result.error!.issues.find(iss => iss.path.join('.') === 'name')
    expect(issue?.message).toStrictEqual('Name should not be less than 4 characters')
  })

  it('should fail when name is longer than 30 chars (NameSchema)', () => {
    const data = { ...valid, name: 'A'.repeat(31) }
    const result = CreateZoneSchema.safeParse(data)
    expect(result.success).toBeFalsy()
    const issue = result.error!.issues.find(iss => iss.path.join('.') === 'name')
    expect(issue?.message).toStrictEqual('Name should not be more than 30 characters')
  })

  it('should fail when extra keys are present due to strict()', () => {
    const data = { ...valid, extra: 'nope' }
    const result = CreateZoneSchema.safeParse(data)
    expect(result.success).toBeFalsy()
    const unrec = result.error!.issues.find(iss => iss.code === 'unrecognized_keys')
    expect(unrec).toBeTruthy()
    expect(unrec?.keys).toContain('extra')
  })
})
