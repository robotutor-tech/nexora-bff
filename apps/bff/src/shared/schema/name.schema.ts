import { z } from 'zod'

export const NameSchema = z
  .string()
  .min(4, 'Name should not be less than 4 characters')
  .max(30, 'Name should not be more than 30 characters')
