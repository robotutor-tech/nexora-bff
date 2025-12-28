import { Body, Controller, Param, Patch, Post, UsePipes } from '@nestjs/common'
import { AccountService } from './account.service'
import { DeviceCredentials } from './types/credentials'
import { ZodValidationPipe } from '@shared'
import { AuthenticateAccountSchema } from './schema/authenticateAccountSchema'
import { AuthenticateAccountDto } from './dto/authenticate-account.dto'
import { TokenResponse } from './types/auth'

@Controller('iam/accounts')
export class AccountController {
  constructor(private readonly accountService: AccountService) {}

  @Post('authenticate')
  @UsePipes(new ZodValidationPipe(AuthenticateAccountSchema))
  authenticateAccount(@Body() authenticateAccountDto: AuthenticateAccountDto): Promise<TokenResponse> {
    return this.accountService.authenticate(authenticateAccountDto)
  }

  @Patch('principal/:principalId/credentials/rotate')
  rotateCredentials(@Param('principalId') principalId: string): Promise<DeviceCredentials> {
    return this.accountService.rotateCredentials(principalId)
  }
}
