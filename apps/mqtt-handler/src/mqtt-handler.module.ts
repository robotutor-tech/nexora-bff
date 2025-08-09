import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common'
import { MqttModule } from './modules/mqtt/mqtt.module'
import { AttachTraceIdMiddleware, LoggerMiddleware } from '@shared'

@Module({
  imports: [MqttModule],
  controllers: [],
  providers: []
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer): void {
    consumer.apply(AttachTraceIdMiddleware).forRoutes('').apply(LoggerMiddleware).forRoutes('')
  }
}
