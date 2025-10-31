import { z } from 'zod'

export const FeedValueSchema = z
  .object({
    value: z.number().min(0).max(100)
  })
  .strict()
