import { createZodDto } from 'nestjs-zod'
import { AuthenticateUserSchema } from '../schema/authenticateUserSchema'
import type { z } from 'zod'

export class AuthenticateUserDto extends createZodDto(AuthenticateUserSchema) {}

export type AuthenticateUserRequest = z.infer<typeof AuthenticateUserSchema>
