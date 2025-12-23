import { createZodDto } from 'nestjs-zod'
import type { z } from 'zod'
import { DeviceLoginSchema } from '../schema/deviceLogin.schema'

export class DeviceLoginDto extends createZodDto(DeviceLoginSchema) {}

export type DeviceLoginRequest = z.infer<typeof DeviceLoginSchema>
