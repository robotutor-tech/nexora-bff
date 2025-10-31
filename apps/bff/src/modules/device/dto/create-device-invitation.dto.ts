import { createZodDto } from 'nestjs-zod'
import { CreateDeviceInvitationSchema } from '../schema/createDeviceInvitation.schema'
import type { z } from 'zod'

export class CreateDeviceInvitationDto extends createZodDto(CreateDeviceInvitationSchema) {}

export type CreateDeviceInvitationRequest = z.infer<typeof CreateDeviceInvitationSchema>
