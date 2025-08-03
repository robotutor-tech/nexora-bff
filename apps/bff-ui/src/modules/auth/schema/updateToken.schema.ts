import { z } from 'zod'

export const UpdateTokenSchema = z.object({ actorId: z.string(), roleId: z.string() }).strict()
