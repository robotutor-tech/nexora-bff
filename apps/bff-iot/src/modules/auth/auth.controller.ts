import { Controller, Get } from '@nestjs/common'
import { AuthService } from './auth.service'
import { ValidatedUser } from './types/auth'

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get('validate')
  validate(): Promise<ValidatedUser> {
    return this.authService.validate()
  }
}
