import { RegisterDeviceSchema } from './registerDevice.schema'

describe('RegisterDeviceSchema', () => {
  const valid = { serialNo: 'S-1', modelNo: 'M-100', type: 'DEVICE' }

  it('should pass for a valid payload', () => {
    const result = RegisterDeviceSchema.safeParse(valid)
    expect(result.success).toBeTruthy()
    expect(result.data).toEqual(valid)
  })

  it('should fail when serialNo is empty', () => {
    const data = { ...valid, serialNo: '' }
    const result = RegisterDeviceSchema.safeParse(data)
    expect(result.success).toBeFalsy()
    const issue = result.error!.issues.find(iss => iss.path.join('.') === 'serialNo')
    expect(issue?.message).toStrictEqual('Serial no is required')
  })

  it('should fail when modelNo is empty', () => {
    const data = { ...valid, modelNo: '' }
    const result = RegisterDeviceSchema.safeParse(data)
    expect(result.success).toBeFalsy()
    const issue = result.error!.issues.find(iss => iss.path.join('.') === 'modelNo')
    expect(issue?.message).toStrictEqual('Model no is required')
  })

  it('should fail when type is not a string', () => {
    const data = { ...valid, type: 123 as unknown as string }
    const result = RegisterDeviceSchema.safeParse(data)
    expect(result.success).toBeFalsy()
    const issue = result.error!.issues.find(iss => iss.path.join('.') === 'type')
    expect(issue?.code).toBe('invalid_type')
  })

  it('should fail when extra keys are present due to strict()', () => {
    const data = { ...valid, extra: 'nope' }
    const result = RegisterDeviceSchema.safeParse(data)
    expect(result.success).toBeFalsy()
    const unrec = result.error!.issues.find(iss => iss.code === 'unrecognized_keys')
    expect(unrec).toBeTruthy()
    expect(unrec?.keys).toContain('extra')
  })
})

