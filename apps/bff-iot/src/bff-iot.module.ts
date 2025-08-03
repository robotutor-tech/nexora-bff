import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common'
import { AttachTraceIdMiddleware, LoggerMiddleware } from '@shared'
import { DevicesModule } from './modules/device/devices.module'
import { AuthModule } from './modules/auth/auth.module'

@Module({
  imports: [AuthModule, DevicesModule],
  controllers: [],
  providers: []
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer): void {
    consumer.apply(AttachTraceIdMiddleware).forRoutes('').apply(LoggerMiddleware).forRoutes('')
  }
}
