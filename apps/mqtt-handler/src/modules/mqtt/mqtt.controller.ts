import { Controller, Post, Body, UsePipes, HttpStatus, HttpCode } from '@nestjs/common'
import { MqttService } from './mqtt.service'
import { ZodValidationPipe } from '@shared'
import { AuthenticationSchema } from './schema/authenticationSchema'
import { AuthenticationDto } from './dto/authenticationDto'
import { AclSchema } from './schema/acl.schema'
import { AclDto } from './dto/acl.dto'
import { AuthenticationResponse, AuthorizationResponse } from './types/mqtt'
import { StatusSchema } from './schema/status.schema'
import { StatusDto } from './dto/status.dto'
import { UpdateDeviceStatus } from './update-device-status'

@Controller('mqtt')
export class MqttController {
  constructor(
    private readonly mqttService: MqttService,
    private readonly updateDeviceStatus: UpdateDeviceStatus
  ) {}

  @Post('auth')
  @HttpCode(HttpStatus.OK)
  @UsePipes(new ZodValidationPipe(AuthenticationSchema))
  authenticate(@Body() authDto: AuthenticationDto): Promise<AuthenticationResponse> {
    return this.mqttService.validateAuthToken(authDto)
  }

  @Post('acl')
  @HttpCode(HttpStatus.OK)
  @UsePipes(new ZodValidationPipe(AclSchema))
  authorize(@Body() aclDto: AclDto): Promise<AuthorizationResponse> {
    return this.mqttService.validateAcl(aclDto)
  }

  @Post('status')
  @HttpCode(HttpStatus.OK)
  @UsePipes(new ZodValidationPipe(StatusSchema))
  async updateStatus(@Body() statusDto: StatusDto): Promise<{ status: 'OK' }> {
    await this.updateDeviceStatus.update(statusDto)
    return { status: 'OK' }
  }
}
