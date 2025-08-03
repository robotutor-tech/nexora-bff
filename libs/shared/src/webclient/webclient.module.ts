import { Module } from '@nestjs/common'
import { RequestContextModule } from '../service/requestContext.module'
import { Webclient } from './webclient.service'

@Module({
  imports: [RequestContextModule],
  providers: [Webclient],
  exports: [Webclient]
})

export class WebclientModule {}
