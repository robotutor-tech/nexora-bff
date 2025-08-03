import { z } from 'zod'

export const CreatePremisesSchema = z
  .object({
    name: z
      .string()
      .min(2, 'Name should not be less than 2 characters')
      .max(30, 'Name should not be more than 30 characters')
  })
  .strict()
