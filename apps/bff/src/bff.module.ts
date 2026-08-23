import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common'
import { identityModule } from './modules/identity/identity.module'
import { AttachTraceIdMiddleware, LoggerMiddleware } from '@shared'
import { BridgeModule } from './modules/bridges/bridge.module'
import { HealthcheckModule } from './modules/healthcheck/healthcheck.module'
import { ProxyModule } from './proxy/proxy.module'

@Module({
  imports: [BridgeModule, HealthcheckModule, identityModule, ProxyModule],
  controllers: [],
  providers: []
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer): void {
    consumer.apply(AttachTraceIdMiddleware).forRoutes('').apply(LoggerMiddleware).forRoutes('')
  }
}
