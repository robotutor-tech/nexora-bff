import { z } from 'zod'

export const AuthLoginSchema = z
  .object({
    email: z.string().email({ message: 'Email should be valid' }),
    password: z
      .string()
      .min(8, 'Name should not be less than 8 characters')
      .max(20, 'Name should not be more than 20 characters')
  })
  .strict()
