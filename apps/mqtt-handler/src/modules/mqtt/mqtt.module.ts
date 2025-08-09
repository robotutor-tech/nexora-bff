import { Module } from '@nestjs/common'
import { MqttService } from './mqtt.service'
import { MqttController } from './mqtt.controller'
import { WebclientModule } from '@shared'

@Module({
  imports: [WebclientModule],
  controllers: [MqttController],
  providers: [MqttService]
})
export class MqttModule {}
