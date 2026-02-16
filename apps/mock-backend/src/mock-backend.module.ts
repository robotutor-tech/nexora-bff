import { Module } from '@nestjs/common'
import { HealthcheckController } from './modules/healthcheck.controller'

@Module({
  imports: [],
  controllers: [HealthcheckController],
  providers: []
})
export class AppModule {}
