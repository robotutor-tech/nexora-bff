import { Module } from '@nestjs/common'
import { IamService } from './iam.service'
import { IamController } from './iam.controller'
import { WebclientModule } from '@shared'

@Module({
  imports: [WebclientModule],
  controllers: [IamController],
  providers: [IamService]
})
export class IamModule {}
