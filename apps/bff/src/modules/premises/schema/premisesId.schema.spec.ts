import { PremisesIdSchema } from './premisesId.schema'

describe('PremisesIdSchema', () => {
  it('should pass for a numeric string', () => {
    const result = PremisesIdSchema.safeParse('123')
    expect(result.success).toBeTruthy()
    expect(result.data).toBe('123')
  })

  it('should fail for non-numeric string', () => {
    const result = PremisesIdSchema.safeParse('12a')
    expect(result.success).toBeFalsy()
    const issue = result.error!.issues[0]
    expect(issue.message).toStrictEqual('PremisesId must be a string containing only numeric digits (0-9).')
  })
})

