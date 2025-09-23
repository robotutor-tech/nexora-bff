import { z } from 'zod'

export const StatusSchema = z.object({
  event: z.string(),
  clientid: z.string(),
  username: z.string(),
  reason: z.string().optional(),
})
