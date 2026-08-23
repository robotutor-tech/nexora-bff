import { NestFactory } from '@nestjs/core'
import { AppModule } from './bff.module'
import { Transport } from '@nestjs/microservices'
import * as cookieParser from 'cookie-parser'
import { FRONTEND_URL } from '@shared'

async function bootstrap() {
  const app = await NestFactory.create(AppModule)
  app.connectMicroservice({
    transport: Transport.KAFKA,
    options: {
      client: {
        clientId: 'nexora-bff',
        brokers: [process.env.KAFKA_URL ?? 'localhost:29092']
      },
      consumer: {
        groupId: 'bff-ui-consumer-group'
      }
    }
  })
  app.setGlobalPrefix('api')
  app.use(cookieParser())
  app.enableCors({ origin: FRONTEND_URL, credentials: true })
  app.startAllMicroservices().catch()
  await app.listen(process.env.port ?? 3001)
}

bootstrap()
