import { z } from 'zod'

export const PremisesIdSchema = z.string().regex(/^\d+$/, {
  message: 'PremisesId must be a string containing only numeric digits (0-9).'
})
