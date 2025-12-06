import { z } from 'zod'

export const AuthenticateUserSchema = z
  .object({
    email: z.string().email({ message: 'Email should be valid' }),
    password: z.string().nonempty('Password is required')
  })
  .strict()
