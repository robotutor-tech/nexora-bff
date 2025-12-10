import { z } from 'zod'

export const AuthenticateActorSchema = z
  .object({
    premisesId: z.string().nonempty({ message: 'PremisesId is required' })
  })
  .strict()
