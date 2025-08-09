import { Controller, Post, Body, UsePipes, HttpStatus, HttpCode } from '@nestjs/common'
import { MqttService } from './mqtt.service'
import { ZodValidationPipe } from '@shared'
import { AuthSchema } from './schema/auth.schema'
import { AuthDto } from './dto/auth.dto'
import { AclSchema } from './schema/acl.schema'
import { AclDto } from './dto/acl.dto'
import { AuthResponse } from './types/mqtt'

@Controller('mqtt')
export class MqttController {
  constructor(private readonly mqttService: MqttService) {}

  @Post('auth')
  @HttpCode(HttpStatus.OK)
  @UsePipes(new ZodValidationPipe(AuthSchema))
  validateMqttToken(@Body() authDto: AuthDto): Promise<AuthResponse> {
    return this.mqttService.validateAuthToken(authDto)
  }

  @Post('acl')
  @HttpCode(HttpStatus.OK)
  @UsePipes(new ZodValidationPipe(AclSchema))
  validateAcl(@Body() aclDto: AclDto): Promise<{ result: 'allow' | 'deny' }> {
    return this.mqttService.validateAcl(aclDto)
  }
}
