import { z } from 'zod'
import { NameSchema } from '../../../shared/schema/name.schema'

export const RegisterDeviceSchema = z
  .object({
    name: NameSchema,
    zoneId: z.string()
  })
  .strict()
