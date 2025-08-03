import { createZodDto } from 'nestjs-zod'
import { CreateTriggerSchema } from '../schema/createTrigger.schema'
import type { z } from 'zod'

export class CreateTriggerDto extends createZodDto(CreateTriggerSchema) {}

export type CreateTriggerRequest = z.infer<typeof CreateTriggerSchema>
