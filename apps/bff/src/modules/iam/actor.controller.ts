import { Controller, Get } from '@nestjs/common'
import { ActorService } from './actor.service'
import { Actor } from '@shared/cache/cache'

@Controller('iam/actors')
export class ActorController {
  constructor(private readonly actorService: ActorService) {}

  @Get('me')
  validate(): Promise<Actor> {
    return this.actorService.getCurrentActor()
  }
}
