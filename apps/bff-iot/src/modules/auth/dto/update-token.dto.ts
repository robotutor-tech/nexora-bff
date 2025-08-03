import { createZodDto } from 'nestjs-zod'
import type { z } from 'zod'
import { UpdateTokenSchema } from '../schema/updateToken.schema'

export class UpdateTokenDto extends createZodDto(UpdateTokenSchema) {}

export type UpdateTokenRequest = z.infer<typeof UpdateTokenSchema>
