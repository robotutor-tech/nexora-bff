import { CreateAutomationSchema } from './createAutomation.schema'

describe('CreateAutomationSchema', () => {
  it('should pass for a valid FEED config', () => {
    const data = {
      name: 'By Feed',
      config: {
        type: 'FEED',
        feedId: 'f-1',
        operator: 'GREATER_THAN',
        value: 10
      }
    }
    const result = CreateAutomationSchema.safeParse(data)
    expect(result.success).toBeTruthy()
    expect(result.data).toEqual(data)
  })

  it('should pass for a valid TIME_RANGE config', () => {
    const data = {
      name: 'By Time',
      config: {
        type: 'TIME_RANGE',
        startTime: '06:00',
        endTime: '07:00'
      }
    }
    const result = CreateAutomationSchema.safeParse(data)
    expect(result.success).toBeTruthy()
    expect(result.data).toEqual(data)
  })

  it('should fail when TIME_RANGE has same start and end time', () => {
    const data = {
      name: 'Invalid Time',
      config: { type: 'TIME_RANGE', startTime: '06:00', endTime: '06:00' }
    }
    const result = CreateAutomationSchema.safeParse(data)
    expect(result.success).toBeFalsy()
    const issue = result.error!.issues.find(iss => iss.path.join('.') === 'config.endTime')
    expect(issue?.message).toStrictEqual('Start time and End time should not be the same')
  })

  it('should fail when FEED config is missing feedId', () => {
    const data = {
      name: 'Invalid Feed',
      config: { type: 'FEED', operator: 'EQUAL', value: 1 }
    }
    const result = CreateAutomationSchema.safeParse(data)
    expect(result.success).toBeFalsy()
    expect(result.error?.issues).toStrictEqual([
      {
        code: 'invalid_type',
        expected: 'string',
        message: 'Required',
        path: ['config', 'feedId'],
        received: 'undefined'
      }
    ])
  })

  it('should fail when invalid type provided in config', () => {
    const data = {
      name: 'Invalid',
      config: { type: 'UNKNOWN' }
    }
    const result = CreateAutomationSchema.safeParse(data)
    expect(result.success).toBeFalsy()
    expect(result.error?.issues).toStrictEqual([
      {
        code: 'invalid_enum_value',
        message: 'Invalid enum value. Expected \'FEED\' | \'TIME_RANGE\', received \'UNKNOWN\'',
        options: ['FEED', 'TIME_RANGE'],
        path: ['config', 'type'],
        received: 'UNKNOWN'
      }
    ])
  })

  it('should fail when extra keys are present due to strict()', () => {
    const data = { name: 'Extra', extra: 'nope', config: { type: 'FEED', feedId: 'f-1', operator: 'EQUAL', value: 1 } }
    const result = CreateAutomationSchema.safeParse(data)
    expect(result.success).toBeFalsy()
    const unrec = result.error!.issues.find(iss => iss.code === 'unrecognized_keys')
    expect(unrec).toBeTruthy()
    expect(unrec?.keys).toContain('extra')
  })
})
