import { Controller, Get, Post, Req, Res } from '@nestjs/common'
import { IdentityService } from './identity.service'
import type { Request, Response } from 'express'
import { AuthenticationResponse } from './types/tokens'

@Controller('identity')
export class identityController {
  constructor(private readonly identityService: IdentityService) {}

  @Get('refresh')
  refresh(@Req() req: Request, @Res({ passthrough: true }) res: Response): Promise<AuthenticationResponse> {
    return this.identityService.refresh(req, res)
  }

  @Post('accounts/users/authenticate')
  authenticateUserAccount(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response
  ): Promise<AuthenticationResponse> {
    return this.identityService.authenticateUserAccount(req, res)
  }
}
