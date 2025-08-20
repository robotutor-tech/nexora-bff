import { Controller, Get, Post, Body, UsePipes } from '@nestjs/common'
import { AuthService } from './auth.service'
import { TokenResponse, ValidatedUser } from './types/auth'
import { AuthLoginDto } from './dto/auth-login.dto'
import { UpdateTokenDto } from './dto/update-token.dto'
import { AuthLoginSchema } from './schema/authLogin.schema'
import { UpdateTokenSchema } from './schema/updateToken.schema'
import { ZodValidationPipe } from '@shared'

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @UsePipes(new ZodValidationPipe(AuthLoginSchema))
  login(@Body() authLoginDto: AuthLoginDto): Promise<TokenResponse> {
    return this.authService.login(authLoginDto)
  }

  @Get('validate')
  validate(): Promise<ValidatedUser> {
    return this.authService.validate()
  }

  @Get('refresh')
  refresh(): Promise<TokenResponse> {
    return this.authService.refresh()
  }

  @Post('token')
  @UsePipes(new ZodValidationPipe(UpdateTokenSchema))
  updateToken(@Body() updateTokenDto: UpdateTokenDto): Promise<TokenResponse> {
    return this.authService.updateToken(updateTokenDto)
  }
}
