import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common'
import { PremisesModule } from './modules/premises/premises.module'
import { ZonesModule } from './modules/zone/zones.module'
import { WidgetsModule } from './modules/widget/widgets.module'
import { DevicesModule } from './modules/device/devices.module'
import { FeedsModule } from './modules/feed/feeds.module'
import { TriggerModule } from './modules/trigger/trigger.module'
import { AuthModule } from './modules/auth/auth.module'
import { ActionModule } from './modules/action/action.module'
import { AutomationModule } from './modules/automation/automation.module'
import { ConditionModule } from './modules/condition/condition.module'
import { AttachTraceIdMiddleware, LoggerMiddleware } from '@shared'
import { BridgeModule } from './modules/bridges/bridge.module'
import { UserModule } from './modules/user/user.module'
import { ActorModule } from './modules/actor/actor.module'

@Module({
  imports: [
    ActionModule,
    ActorModule,
    AuthModule,
    AutomationModule,
    BridgeModule,
    ConditionModule,
    DevicesModule,
    FeedsModule,
    PremisesModule,
    TriggerModule,
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
