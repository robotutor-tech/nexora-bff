import { z } from 'zod'

export const AuthenticationSchema = z
  .object({
    clientId: z.string(),
    password: z.string()
  })
  .strict()
