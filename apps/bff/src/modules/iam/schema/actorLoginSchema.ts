import { z } from 'zod'

export const ActorLoginSchema = z.object({ actorId: z.string(), roleId: z.string() }).strict()
