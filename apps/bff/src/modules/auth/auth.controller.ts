import { Controller, Get, Post, Body, UsePipes } from '@nestjs/common'
import { AuthService } from './auth.service'
import { TokenResponse, ValidatedUser } from './types/auth'
import { AuthLoginDto } from './dto/auth-login.dto'
import { ActorLoginDto } from './dto/actor-login.dto'
import { AuthLoginSchema } from './schema/authLogin.schema'
import { ActorLoginSchema } from './schema/actorLoginSchema'
import { ZodValidationPipe } from '@shared'
import { DeviceLoginSchema } from './schema/deviceLoginSchema'
import { DeviceLoginDto } from './dto/device-login.dto'

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

  @Post('login/device')
  @UsePipes(new ZodValidationPipe(DeviceLoginSchema))
  deviceLogin(@Body() deviceLoginDto: DeviceLoginDto): Promise<TokenResponse> {
    return this.authService.deviceLogin(deviceLoginDto)
  }

  @Post('login/actor')
  @UsePipes(new ZodValidationPipe(ActorLoginSchema))
  actorLogin(@Body() actorLoginDto: ActorLoginDto): Promise<TokenResponse> {
    return this.authService.actorLogin(actorLoginDto)
  }
}
