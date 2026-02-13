import { z } from 'zod'

export const CommissionDeviceSchema = z
  .object({
    serialNo: z.string().nonempty('Serial no is required'),
    modelNo: z.string().nonempty('Model no is required'),
    osName: z.string().nonempty('OS name is required'),
    osVersion: z.string().nonempty('OS version is required')
  })
  .strict()
