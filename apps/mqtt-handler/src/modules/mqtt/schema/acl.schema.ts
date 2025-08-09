import { z } from 'zod'

export const AclSchema = z
  .object({
    username: z.string()
  })
  .strict()
