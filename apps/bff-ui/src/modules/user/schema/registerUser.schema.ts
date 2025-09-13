import { z } from 'zod'
import { NameSchema } from '../../../shared/schema/name.schema'

export const RegisterUserSchema = z
  .object({
    name: NameSchema,
    email: z.string().email({ message: 'Email should be valid' }),
    password: z
      .string()
      .min(8, 'Name should not be less than 8 characters')
      .max(20, 'Name should not be more than 20 characters')
      .regex(
        /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d).+$/,
        'Password must contain at least one uppercase letter, one lowercase letter, and one digit'
      ),
    mobile: z.string().regex(/^\d{10}$/, 'Mobile number must be exactly 10 digits')
  })
  .strict()
