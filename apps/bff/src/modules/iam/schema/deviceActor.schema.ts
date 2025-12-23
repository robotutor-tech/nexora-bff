import { z } from 'zod'

export const DeviceActorSchema = z
  .object({
    modelNo: z.string().nonempty('ModelNo is required.'),
    serialNo: z.string().nonempty('SerialNo is required.'),
    osName: z.string().nonempty('OsName is required.'),
    osVersion: z.string().nonempty('OsVersion is required.')
  })
  .strict()
