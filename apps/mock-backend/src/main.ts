import { NestFactory } from '@nestjs/core'
import { AppModule } from './mock-backend.module'
import { Transport } from '@nestjs/microservices'

async function bootstrap() {
  const app = await NestFactory.create(AppModule)
  app.connectMicroservice({
    transport: Transport.KAFKA,
    options: {
      client: {
        clientId: 'mock-backend',
        brokers: [process.env.KAFKA_URL ?? 'localhost:9092']
      },
      consumer: {
        groupId: 'mock-backend-consumer-group'
      }
    }
  })
  app.startAllMicroservices().catch()
  await app.listen(process.env.port ?? 3002)
}

bootstrap()
