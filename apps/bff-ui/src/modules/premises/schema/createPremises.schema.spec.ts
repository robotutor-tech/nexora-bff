import { CreatePremisesSchema } from './createPremises.schema'

describe('CreatePremisesSchema', () => {
  const valid = {
    name: 'Home',
    address: { street: '12', city: 'ci', state: 'st', country: 'in', postalCode: '123456' }
  }

  it('should pass for a valid payload', () => {
    const result = CreatePremisesSchema.safeParse(valid)
    expect(result.success).toBeTruthy()
    expect(result.data).toEqual(valid)
  })

  it('should fail when name is shorter than 4 chars (NameSchema)', () => {
    const data = { ...valid, name: 'Hom' }
    const result = CreatePremisesSchema.safeParse(data)
    expect(result.success).toBeFalsy()
    const issue = result.error!.issues.find(iss => iss.path.join('.') === 'name')
    expect(issue?.message).toStrictEqual('Name should not be less than 4 characters')
  })

  it('should fail when address has extra keys due to strict()', () => {
    const data = { ...valid, address: { ...valid.address, extra: 'x' } }
    const result = CreatePremisesSchema.safeParse(data)
    expect(result.success).toBeFalsy()
  })

  it('should fail when extra keys are present due to strict()', () => {
    const result = CreatePremisesSchema.safeParse({ ...valid, extra: 'x' })
    expect(result.success).toBeFalsy()
    const unrec = (result ).error?.issues.find((iss: any) => iss.code === 'unrecognized_keys')
    expect(unrec).toBeTruthy()
  })
})

