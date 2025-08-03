import { PipeTransform, Injectable, BadRequestException } from '@nestjs/common'
import { ZodError, ZodType } from 'zod'
import { Documents, InputValidationError } from '../types/types'

export const formatZodErrors = (error: ZodError): InputValidationError[] => {
  return error.errors.map(issue => ({
    field: issue.path.join('.'),
    errors: [issue.message]
  }))
}

@Injectable()
export class ZodValidationPipe implements PipeTransform {
  constructor(private readonly schema: ZodType) {}

  transform(value: Documents): Documents {
    const result = this.schema.safeParse(value)
    if (!result.success) {
      throw new BadRequestException({
        errorCode: 'NEXORA-0101',
        message: 'Validation error',
        details: formatZodErrors(result.error)
      })
    }
    return result.data as Documents
  }
}
