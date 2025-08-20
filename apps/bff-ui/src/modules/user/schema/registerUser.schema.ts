import { z } from 'zod'

export const RegisterUserSchema = z
  .object({
    name: z
      .string()
      .min(2, 'Name should not be less than 2 characters')
      .max(30, 'Name should not be more than 30 characters'),
    email: z.string().email({ message: 'Email should be valid' }),
    password: z
      .string()
      .min(8, 'Name should not be less than 8 characters')
      .max(20, 'Name should not be more than 20 characters')
      .regex(
        /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d).+$/,
        'Password must contain at least one uppercase letter, one lowercase letter, and one digit'
      )
  })
  .strict()
