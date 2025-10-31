import { createZodDto } from 'nestjs-zod'
import { AuthLoginSchema } from '../schema/authLogin.schema'
import type { z } from 'zod'

export class AuthLoginDto extends createZodDto(AuthLoginSchema) {}

export type AuthLoginRequest = z.infer<typeof AuthLoginSchema>
