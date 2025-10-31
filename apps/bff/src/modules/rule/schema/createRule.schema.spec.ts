import { CreateRuleSchema } from './createRule.schema'

describe('CreateRuleSchema', () => {
  it('should pass for a valid TRIGGER VOICE config', () => {
    const data = {
      name: 'Voice Trigger',
      type: 'TRIGGER',
      config: { type: 'VOICE', commands: ['turn on'] }
    }
    const result = CreateRuleSchema.safeParse(data)
    expect(result.success).toBeTruthy()
    expect(result.data).toEqual(data)
  })

  it('should fail when type and config.type are incompatible', () => {
    const data = {
      name: 'Invalid Combo',
      type: 'ACTION',
      config: { type: 'VOICE', commands: ['go'] }
    } 
    const result = CreateRuleSchema.safeParse(data)
    expect(result.success).toBeFalsy()
    const issue = result.error!.issues.find(iss => iss.message === 'Invalid rule type and config type combination')
    expect(issue).toBeTruthy()
  })

  it('should validate FEED_VALUE config numeric constraints', () => {
    const data = {
      name: 'Feed Value',
      type: 'ACTION',
      config: { type: 'FEED_VALUE', feedId: '12', value: '200' }
    } 
    const result = CreateRuleSchema.safeParse(data)
    expect(result.success).toBeFalsy()
    const issue = result.error!.issues.find(iss => iss.path.join('.') === 'config.value')
    expect(issue?.message).toStrictEqual('value must be a positive number between 0 and 100.')
  })

  it('should pass for a valid ACTION FEED_VALUE config', () => {
    const data = {
      name: 'Action Feed',
      type: 'ACTION',
      config: { type: 'FEED_VALUE', feedId: '12', value: '50' }
    }
    const result = CreateRuleSchema.safeParse(data)
    expect(result.success).toBeTruthy()
  })

  it('should pass for a valid CONDITION TIME_RANGE config', () => {
    const data = {
      name: 'Time Range',
      type: 'CONDITION',
      config: { type: 'TIME_RANGE', startTime: '06:00', endTime: '07:00' }
    }
    const result = CreateRuleSchema.safeParse(data)
    expect(result.success).toBeTruthy()
  })

  it('should fail when extra keys are present due to strict()', () => {
    const data = { name: 'X', type: 'TRIGGER', config: { type: 'VOICE', commands: ['a'] }, extra: 'nope' }
    const result = CreateRuleSchema.safeParse(data )
    expect(result.success).toBeFalsy()
    const unrec = result.error!.issues.find(iss => iss.code === 'unrecognized_keys')
    expect(unrec).toBeTruthy()
    expect(unrec?.keys).toContain('extra')
  })
})

