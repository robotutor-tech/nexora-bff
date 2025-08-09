import { Module } from '@nestjs/common'
import { KafkaService } from './kafka.service'
import { ClientsModule } from '@nestjs/microservices'
import { KafkaConfig } from './kafka.config'

@Module({
  imports: [
    ClientsModule.register({
      clients: [
        {
          name: 'KAFKA_CLIENT',
          ...KafkaConfig
        }
      ],
      isGlobal: true
    })
  ],
  providers: [KafkaService],
  exports: [KafkaService]
})
export class KafkaModule {}
