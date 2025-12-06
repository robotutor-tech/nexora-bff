import { z } from 'zod'
import { NameSchema } from '../../../shared/schema/name.schema'

export const RegisterUserSchema = z
  .object({
    name: NameSchema,
    email: z.string().email({ message: 'Email should be valid' }),
    password: z
      .string()
      .min(8, 'Name should not be less than 8 characters')
      .max(20, 'Name should not be more than 20 characters'),
    mobile: z.string().nonempty({ message: 'Mobile number is required' })
  })
  .strict()
