import { createZodDto } from 'nestjs-zod'
import type { z } from 'zod'
import { AuthenticationSchema } from '../schema/authenticationSchema'

export class AuthenticationDto extends createZodDto(AuthenticationSchema) {}

export type AuthenticationRequest = z.infer<typeof AuthenticationSchema>
