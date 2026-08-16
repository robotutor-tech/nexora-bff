import { Controller, Get, Post, Body, UsePipes } from '@nestjs/common'
import { identityService } from './identity.service'
import { TokenResponse, ValidatedUser } from './types/auth'
import { ZodValidationPipe } from '@shared'
import { DeviceLoginSchema } from './schema/deviceLogin.schema'
import { DeviceLoginDto } from './dto/device-login.dto'

@Controller('identity')
export class identityController {
  constructor(private readonly identityService: identityService) {}

  @Get('validate')
  validate(): Promise<ValidatedUser> {
    return this.identityService.validate()
  }

  @Get('refresh')
  refresh(): Promise<TokenResponse> {
    return this.identityService.refresh()
  }

  @Post('login/device')
  @UsePipes(new ZodValidationPipe(DeviceLoginSchema))
  deviceLogin(@Body() deviceLoginDto: DeviceLoginDto): Promise<TokenResponse> {
    return this.identityService.deviceLogin(deviceLoginDto)
  }

}
