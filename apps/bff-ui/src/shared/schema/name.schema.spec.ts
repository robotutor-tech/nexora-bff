import { NameSchema } from './name.schema'

describe('NameSchema', () => {
  it('should accept a valid name (4..30 chars)', () => {
    const result = NameSchema.safeParse('John Doe')
    expect(result.success).toBeTruthy()
    if (result.success) {
      expect(result.data).toBe('John Doe')
    }
  })

  it('should reject names shorter than 4 chars', () => {
    const result = NameSchema.safeParse('Joe') // 3 chars
    expect(result.success).toBeFalsy()
    if (!result.success) {
      const issue = result.error.issues[0]
      expect(issue.message).toBe('Name should not be less than 4 characters')
      expect(issue.path.join('.')).toBe('')
    }
  })

  it('should reject names longer than 30 chars', () => {
    const longName = 'A'.repeat(31)
    const result = NameSchema.safeParse(longName)
    expect(result.success).toBeFalsy()
    if (!result.success) {
      const issue = result.error.issues[0]
      expect(issue.message).toBe('Name should not be more than 30 characters')
    }
  })
})

