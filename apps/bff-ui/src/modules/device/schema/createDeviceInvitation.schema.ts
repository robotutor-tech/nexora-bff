import { z } from 'zod'
import { NameSchema } from '../../../shared/schema/name.schema'

export const CreateDeviceInvitationSchema = z
  .object({
    name: NameSchema,
    zoneId: z.string()
  })
  .strict()
