import { z } from 'zod'

export const AuthenticateAccountSchema = z
  .object({
    credentialId: z.string().nonempty({ message: 'CredentialId should be valid' }),
    secret: z.string().nonempty('Secret is required')
  })
  .strict()
