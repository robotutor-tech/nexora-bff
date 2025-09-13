import { BadRequestException } from '@nestjs/common'
import { z } from 'zod'
import { ZodValidationPipe, formatZodErrors } from './ZodValidation'

describe('ZodValidationPipe', () => {
  const personSchema = z.object({ name: z.string().min(2, 'too short'), age: z.number().int().nonnegative() })

  it('should pass-through valid value', () => {
    const pipe = new ZodValidationPipe(personSchema)
    const value = { name: 'Alice', age: 30 }

    const out = pipe.transform(value)

    expect(out).toStrictEqual(value)
  })

  it('should throw BadRequestException with formatted issues for invalid value', () => {
    const pipe = new ZodValidationPipe(personSchema)
    const value = { name: 'A', age: -1 }

    try {
      pipe.transform(value as unknown as Record<string, unknown>)
      fail('Expected BadRequestException')
    } catch (err) {
      expect(err).toBeInstanceOf(BadRequestException)
      const res = (err as BadRequestException).getResponse() as Record<string, unknown>
      expect(res).toMatchObject({ errorCode: 'NEXORA-0101', message: 'Validation error' })
      const details = (res.details ?? []) as Array<{ field: string; errors: string[] }>
      expect(details).toEqual(
        expect.arrayContaining([
          expect.objectContaining({ field: 'name', errors: ['too short'] }),
          expect.objectContaining({ field: 'age', errors: [expect.any(String)] })
        ])
      )
    }
  })
})

describe('formatZodErrors', () => {
  it('should map zod issues to InputValidationError[]', () => {
    const schema = z.object({ email: z.string().email('invalid email') })
    const result = schema.safeParse({ email: 'not-email' })
    expect(result.success).toBeFalsy()
    if (!result.success) {
      const out = formatZodErrors(result.error)
      expect(out).toStrictEqual([{ field: 'email', errors: ['invalid email'] }])
    }
  })
})
