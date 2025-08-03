import { createZodDto } from 'nestjs-zod'
import { CreateActionSchema } from '../schema/createAction.schema'
import type { z } from 'zod'

export class CreateActionDto extends createZodDto(CreateActionSchema) {}

export type CreateActionRequest = z.infer<typeof CreateActionSchema>
