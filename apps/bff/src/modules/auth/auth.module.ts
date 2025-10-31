import { Module } from '@nestjs/common'
import { AuthService } from './auth.service'
import { AuthController } from './auth.controller'
import { WebclientModule } from '@shared'

@Module({
  imports: [WebclientModule],
  controllers: [AuthController],
  providers: [AuthService]
})
export class AuthModule {}
