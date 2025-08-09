import { NestFactory } from '@nestjs/core'
import { AppModule } from './mqtt-handler.module'

async function bootstrap() {
  const app = await NestFactory.create(AppModule)
  app.setGlobalPrefix('api')
  await app.listen(process.env.port ?? 3003)
}

bootstrap()
