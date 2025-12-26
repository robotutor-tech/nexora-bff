import { createZodDto } from 'nestjs-zod'
import { CommissionDeviceSchema } from '../schema/commissionDevice.schema'
import type { z } from 'zod'

export class CommissionDeviceDto extends createZodDto(CommissionDeviceSchema) {}

export type CommissionDeviceRequest = z.infer<typeof CommissionDeviceSchema>
