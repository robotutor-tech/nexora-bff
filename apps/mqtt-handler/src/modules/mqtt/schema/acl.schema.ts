import { z } from 'zod'

export const AclSchema = z.object({
  clientId: z.string(),
  internalId: z.string(),
  topic: z.string(),
  action: z.string()
})
