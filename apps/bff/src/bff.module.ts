import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common'
import { PremisesModule } from './modules/premises/premises.module'
import { ZonesModule } from './modules/zone/zones.module'
import { WidgetsModule } from './modules/widget/widgets.module'
import { DevicesModule } from './modules/device/devices.module'
import { FeedsModule } from './modules/feed/feeds.module'
import { RuleModule } from './modules/rule/rule.module'
import { IamModule } from './modules/iam/iam.module'
import { AutomationModule } from './modules/automation/automation.module'
import { AttachTraceIdMiddleware, LoggerMiddleware } from '@shared'
import { BridgeModule } from './modules/bridges/bridge.module'
import { UserModule } from './modules/user/user.module'
import { ActorModule } from './modules/actor/actor.module'

@Module({
  imports: [
    ActorModule,
    IamModule,
    AutomationModule,
    BridgeModule,
    DevicesModule,
    FeedsModule,
    PremisesModule,
    RuleModule,
    UserModule,
    WidgetsModule,
    ZonesModule
  ],
  controllers: [],
  providers: []
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer): void {
    consumer.apply(AttachTraceIdMiddleware).forRoutes('').apply(LoggerMiddleware).forRoutes('')
  }
}
