import { Module } from '@nestjs/common'
import { ChainBuilder } from './chain.builder'
import { ChainFactory } from './chain.factory'
import { HandlersModule } from '../handlers/handlers.module'

@Module({
  imports: [HandlersModule],
  providers: [ChainBuilder, ChainFactory],
  exports: [ChainFactory]
})
export class ChainModule {}
