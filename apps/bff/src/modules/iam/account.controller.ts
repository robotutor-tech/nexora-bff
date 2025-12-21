import { Controller, Param, Patch } from '@nestjs/common'
import { AccountService } from './account.service'
import { DeviceCredentials } from './types/credentials'

@Controller('iam/accounts')
export class AccountController {
  constructor(private readonly accountService: AccountService) {}

  @Patch(':accountId/credentials/rotate')
  rotateCredentials(@Param('accountId') accountId: string): Promise<DeviceCredentials> {
    return this.accountService.rotateCredentials(accountId)
  }
}
