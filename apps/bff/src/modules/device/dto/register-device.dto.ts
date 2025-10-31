import { createZodDto } from 'nestjs-zod'
import { RegisterDeviceSchema } from '../schema/registerDevice.schema'
import type { z } from 'zod'

export class RegisterDeviceDto extends createZodDto(RegisterDeviceSchema) {}

export type RegisterDeviceRequest = z.infer<typeof RegisterDeviceSchema>
