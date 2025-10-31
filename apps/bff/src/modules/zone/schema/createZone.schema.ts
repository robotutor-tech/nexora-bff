import { z } from 'zod'
import { NameSchema } from '../../../shared/schema/name.schema'

export const CreateZoneSchema = z
  .object({ name: NameSchema, })
  .strict()
