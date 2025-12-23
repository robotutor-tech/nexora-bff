import { createZodDto } from 'nestjs-zod'
import { AuthenticateAccountSchema } from '../schema/authenticateAccountSchema'
import type { z } from 'zod'

export class AuthenticateAccountDto extends createZodDto(AuthenticateAccountSchema) {}

export type AuthenticateAccountRequest = z.infer<typeof AuthenticateAccountSchema>
