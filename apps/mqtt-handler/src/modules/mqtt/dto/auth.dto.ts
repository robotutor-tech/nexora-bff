import { createZodDto } from 'nestjs-zod'
import type { z } from 'zod'
import { AuthSchema } from '../schema/auth.schema'

export class AuthDto extends createZodDto(AuthSchema) {}

export type AuthRequest = z.infer<typeof AuthSchema>
