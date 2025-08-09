import { NestFactory } from '@nestjs/core'
import { AppModule } from './bff-iot.module'
import { KafkaConfig } from '@shared/kafka/kafka.config'

async function bootstrap() {
  const app = await NestFactory.create(AppModule)
  app.connectMicroservice(KafkaConfig)
  app.setGlobalPrefix('api')
  await app.listen(process.env.port ?? 3002)
}

bootstrap()
