import { createZodDto } from 'nestjs-zod'
import type { z } from 'zod'
import { DeviceActorSchema } from '../schema/deviceActor.schema'

export class DeviceActorDto extends createZodDto(DeviceActorSchema) {}

export type DeviceActorRequest = z.infer<typeof DeviceActorSchema>
