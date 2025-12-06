import { z } from 'zod'

export const DeviceLoginSchema = z
  .object({
    deviceId: z.string().nonempty('Device Id is required'),
    secret: z.string().nonempty('Secret is required')
  })
  .strict()
