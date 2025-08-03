import { NestFactory } from '@nestjs/core'
import { AppModule } from './bff-iot.module'

async function bootstrap() {
  const app = await NestFactory.create(AppModule)
  await app.listen(process.env.port ?? 3002)
}

bootstrap()
