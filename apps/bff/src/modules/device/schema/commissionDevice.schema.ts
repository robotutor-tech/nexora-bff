import { z } from 'zod'

export const CommissionDeviceSchema = z
  .object({
    credentialId: z.string().nonempty('Credential id is required'),
    secret: z.string().nonempty('Secret is required'),
    serialNo: z.string().nonempty('Serial no is required'),
    modelNo: z.string().nonempty('Model no is required'),
    osName: z.string().nonempty('OS name is required'),
    osVersion: z.string().nonempty('OS version is required')
  })
  .strict()
