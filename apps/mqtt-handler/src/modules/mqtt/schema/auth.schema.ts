import { z } from 'zod'

export const AuthSchema = z
  .object({
    password: z.string()
  })
  .strict()
