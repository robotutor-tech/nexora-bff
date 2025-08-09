import { createZodDto } from 'nestjs-zod'
import { AclSchema } from '../schema/acl.schema'
import type { z } from 'zod'

export class AclDto extends createZodDto(AclSchema) {}

export type AclRequest = z.infer<typeof AclSchema>
