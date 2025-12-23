import { Controller, Get, Post, Body, UsePipes } from '@nestjs/common'
import { IamService } from './iam.service'
import { TokenResponse, ValidatedUser } from './types/auth'
import { ZodValidationPipe } from '@shared'
import { DeviceLoginSchema } from './schema/deviceLogin.schema'
import { DeviceLoginDto } from './dto/device-login.dto'

@Controller('iam')
export class IamController {
  constructor(private readonly iamService: IamService) {}

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

}
