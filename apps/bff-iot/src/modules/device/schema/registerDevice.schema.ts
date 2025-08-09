import { z } from 'zod'

export const RegisterDeviceSchema = z
  .object({
    serialNo: z.string().nonempty('Serial no is required'),
    modelNo: z.string().nonempty('Model no is required'),
    type: z.string().nonempty('Type is required')
  })
  .strict()
