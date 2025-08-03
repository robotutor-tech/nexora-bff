import { createZodDto } from 'nestjs-zod'
import { CreateZoneSchema } from '../schema/createZone.schema'
import type { z } from 'zod'

export class CreateZoneDto extends createZodDto(CreateZoneSchema) {}

export type CreateZoneRequest = z.infer<typeof CreateZoneSchema>
