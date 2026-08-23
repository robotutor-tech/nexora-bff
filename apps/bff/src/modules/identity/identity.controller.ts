import { Controller, Get, Post, Req, Res } from '@nestjs/common'
import { IdentityService } from './identity.service'
import type { Request, Response } from 'express'
import { AuthenticationResponse, ValidatedResponse } from './types/tokens'

@Controller('identity')
export class identityController {
  constructor(private readonly identityService: IdentityService) {}

  @Get('sessions/validate')
  validate(@Req() req: Request, @Res({ passthrough: true }) res: Response): Promise<ValidatedResponse> {
    return this.identityService.validate(req, res)
  }

  @Post('accounts/users/authenticate')
  authenticateUserAccount(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response
  ): Promise<AuthenticationResponse> {
    return this.identityService.authenticateUserAccount(req, res)
  }
}
