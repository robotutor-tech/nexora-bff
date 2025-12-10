import { createZodDto } from 'nestjs-zod'
import type { z } from 'zod'
import { AuthenticateActorSchema } from '../schema/authenticateActorSchema'

export class AuthenticateActorDto extends createZodDto(AuthenticateActorSchema) {}

export type AuthenticateActorRequest = z.infer<typeof AuthenticateActorSchema>
