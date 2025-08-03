import { createZodDto } from 'nestjs-zod'
import { CreatePremisesSchema } from '../schema/createPremises.schema'
import type { z } from 'zod'

export class CreatePremisesDto extends createZodDto(CreatePremisesSchema) {}

export type CreatePremisesRequest = z.infer<typeof CreatePremisesSchema>
