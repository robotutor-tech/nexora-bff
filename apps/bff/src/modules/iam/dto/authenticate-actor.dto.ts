import { createZodDto } from 'nestjs-zod'
import type { z } from 'zod'
import { AuthenticateActorSchema } from '../schema/authenticateActor.schema'

export class AuthenticateActorDto extends createZodDto(AuthenticateActorSchema) {}

export type AuthenticateActorRequest = z.infer<typeof AuthenticateActorSchema>
