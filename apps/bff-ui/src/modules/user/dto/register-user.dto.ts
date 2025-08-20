import { createZodDto } from 'nestjs-zod'
import { RegisterUserSchema } from '../schema/registerUser.schema'
import type { z } from 'zod'

export class RegisterUserDto extends createZodDto(RegisterUserSchema) {}

export type RegisterUserRequest = z.infer<typeof RegisterUserSchema>
