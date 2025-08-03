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

@Module({
  imports: [
    ActionModule,
    AuthModule,
    AutomationModule,
    ConditionModule,
    DevicesModule,
    FeedsModule,
    PremisesModule,
    TriggerModule,
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
