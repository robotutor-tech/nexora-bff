import { createZodDto } from 'nestjs-zod'
import type { z } from 'zod'
import { ActorLoginSchema } from '../schema/actorLoginSchema'

export class ActorLoginDto extends createZodDto(ActorLoginSchema) {}

export type ActorLoginRequest = z.infer<typeof ActorLoginSchema>
