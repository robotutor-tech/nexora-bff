import { createZodDto } from 'nestjs-zod'
import { RegisterUserSchema } from '../schema/registerUser.schema'
import type { z } from 'zod'

export class CreateUserDto extends createZodDto(RegisterUserSchema) {}

export type RegisterUserRequest = z.infer<typeof RegisterUserSchema>
