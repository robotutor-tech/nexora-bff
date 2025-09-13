import { createZodDto } from 'nestjs-zod'
import { CreateRuleSchema } from '../schema/createRule.schema'
import type { z } from 'zod'

export class CreateRuleDto extends createZodDto(CreateRuleSchema) {}

export type CreateRuleRequest = z.infer<typeof CreateRuleSchema>
