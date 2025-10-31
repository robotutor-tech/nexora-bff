import { createZodDto } from 'nestjs-zod'
import { CreateAutomationSchema } from '../schema/createAutomation.schema'
import type { z } from 'zod'

export class CreateAutomationDto extends createZodDto(CreateAutomationSchema) {}

export type CreateAutomationRequest = z.infer<typeof CreateAutomationSchema>
