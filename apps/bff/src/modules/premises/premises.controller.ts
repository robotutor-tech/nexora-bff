import { Controller, Get, Post, Body, Param, UsePipes } from '@nestjs/common'
import { PremisesService } from './premises.service'
import { CreatePremisesDto } from './dto/create-premises.dto'
import { Premises } from './types/premises'
import { CreatePremisesSchema } from './schema/createPremises.schema'
import { PremisesIdSchema } from './schema/premisesId.schema'
import { ZodValidationPipe } from '@shared'

@Controller('premises')
export class PremisesController {
  constructor(private readonly premisesService: PremisesService) {}

  @Post()
  @UsePipes(new ZodValidationPipe(CreatePremisesSchema))
  createPremises(@Body() createPremisesDto: CreatePremisesDto): Promise<Premises> {
    return this.premisesService.createPremises(createPremisesDto)
  }

  @Get()
  getAllPremises(): Promise<Premises[]> {
    return this.premisesService.getAllPremises()
  }

  @Get(':premisesId')
  @UsePipes(new ZodValidationPipe(PremisesIdSchema))
  getPremises(@Param('premisesId') premisesId: string): Promise<Premises> {
    return this.premisesService.getPremises(premisesId)
  }
}
