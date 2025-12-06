import { NestFactory } from '@nestjs/core'
import { AppModule } from './bff.module'
import { Transport } from '@nestjs/microservices'

async function bootstrap() {
  const app = await NestFactory.create(AppModule)
  app.connectMicroservice({
    transport: Transport.KAFKA,
    options: {
      client: {
        clientId: 'nexora-bff',
        brokers: [process.env.KAFKA_URL ?? 'localhost:9092']
      },
      consumer: {
        groupId: 'bff-ui-consumer-group'
      }
    }
  })
  app.setGlobalPrefix('api')
  app.startAllMicroservices().catch()
  await app.listen(process.env.port ?? 3001)
}

bootstrap()
