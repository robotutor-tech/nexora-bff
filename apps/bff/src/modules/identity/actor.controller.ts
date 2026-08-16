import { Body, Controller, Get, Post, UsePipes } from '@nestjs/common'
import { ActorService } from './actor.service'
import { Actor } from '@shared/cache/cache'
import { ZodValidationPipe } from '@shared'
import { AuthenticateActorSchema } from './schema/authenticateActor.schema'
import { AuthenticateActorDto } from './dto/authenticate-actor.dto'
import { TokenResponse } from './types/auth'

@Controller('identity/actors')
export class ActorController {
  constructor(private readonly actorService: ActorService) {}

  @Get('me')
  validate(): Promise<Actor> {
    return this.actorService.getCurrentActor()
  }

  @Post('authenticate')
  @UsePipes(new ZodValidationPipe(AuthenticateActorSchema))
  actorLogin(@Body() authenticateActorDto: AuthenticateActorDto): Promise<TokenResponse> {
    return this.actorService.authenticate(authenticateActorDto)
  }
}
