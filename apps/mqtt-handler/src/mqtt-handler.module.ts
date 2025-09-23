import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common'
import { MqttModule } from './modules/mqtt/mqtt.module'
import { AttachTraceIdMiddleware, LoggerMiddleware } from '@shared'
import { CacheModule } from '@shared/cache/cache.module'

@Module({
  imports: [MqttModule, CacheModule],
  controllers: [],
  providers: []
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer): void {
    consumer.apply(AttachTraceIdMiddleware).forRoutes('').apply(LoggerMiddleware).forRoutes('')
  }
}
