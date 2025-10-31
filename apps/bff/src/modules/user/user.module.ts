import { Module } from '@nestjs/common'
import { UserService } from './user.service'
import { UserController } from './user.controller'
import { WebclientModule } from '@shared'

@Module({
  imports: [WebclientModule],
  controllers: [UserController],
  providers: [UserService]
})
export class UserModule {}
