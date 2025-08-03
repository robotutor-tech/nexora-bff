import { createZodDto } from 'nestjs-zod'
import { CreateConditionSchema } from '../schema/createCondition.schema'
import type { z } from 'zod'

export class CreateConditionDto extends createZodDto(CreateConditionSchema) {}

export type CreateConditionRequest = z.infer<typeof CreateConditionSchema>
