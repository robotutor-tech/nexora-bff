import { createZodDto } from 'nestjs-zod'
import type { z } from 'zod'
import { StatusSchema } from '../schema/status.schema'

export class StatusDto extends createZodDto(StatusSchema) {}

export type StatusRequest = z.infer<typeof StatusSchema>
