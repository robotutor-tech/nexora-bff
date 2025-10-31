import { z } from 'zod'
import { NameSchema } from '../../../shared/schema/name.schema'

export const AddressSchema = z.object({
  street: z
    .string()
    .min(2, 'Street should not be less than 2 characters')
    .max(100, 'Street should not be more than 100 characters'),
  city: z
    .string()
    .min(2, 'City should not be less than 2 characters')
    .max(50, 'City should not be more than 50 characters'),
  state: z
    .string()
    .min(2, 'State should not be less than 2 characters')
    .max(50, 'State should not be more than 50 characters'),
  country: z
    .string()
    .min(2, 'Country should not be less than 2 characters')
    .max(50, 'Country should not be more than 50 characters'),
  postalCode: z
    .string()
    .min(2, 'Postal code should not be less than 2 characters')
    .max(20, 'Postal code should not be more than 20 characters')
})
  .strict()

export const CreatePremisesSchema = z
  .object({
    name: NameSchema,
    address: AddressSchema
  })
  .strict()
