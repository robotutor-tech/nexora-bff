import { Controller, Get, Post, Body, UsePipes } from '@nestjs/common'
import { IamService } from './iam.service'
import { TokenResponse, ValidatedUser } from './types/auth'
import { AuthenticateUserDto } from './dto/authenticate-user.dto'
import { ActorLoginDto } from './dto/actor-login.dto'
import { AuthenticateUserSchema } from './schema/authenticateUserSchema'
import { ActorLoginSchema } from './schema/actorLoginSchema'
import { ZodValidationPipe } from '@shared'
import { DeviceLoginSchema } from './schema/deviceLoginSchema'
import { DeviceLoginDto } from './dto/device-login.dto'

@Controller('iam')
export class IamController {
  constructor(private readonly iamService: IamService) {}

  @Post('authenticate')
  @UsePipes(new ZodValidationPipe(AuthenticateUserSchema))
  authenticateAccount(@Body() authenticateUserDto: AuthenticateUserDto): Promise<TokenResponse> {
    return this.iamService.authenticateUser(authenticateUserDto)
  }

  @Get('validate')
  validate(): Promise<ValidatedUser> {
    return this.iamService.validate()
  }

  @Get('refresh')
  refresh(): Promise<TokenResponse> {
    return this.iamService.refresh()
  }

  @Post('login/device')
  @UsePipes(new ZodValidationPipe(DeviceLoginSchema))
  deviceLogin(@Body() deviceLoginDto: DeviceLoginDto): Promise<TokenResponse> {
    return this.iamService.deviceLogin(deviceLoginDto)
  }

  @Post('login/actor')
  @UsePipes(new ZodValidationPipe(ActorLoginSchema))
  actorLogin(@Body() actorLoginDto: ActorLoginDto): Promise<TokenResponse> {
    return this.iamService.actorLogin(actorLoginDto)
  }
}
