import { Controller, Get } from '@nestjs/common'

@Controller('healthcheck')
export class HealthcheckController {
  constructor() {}

  @Get()
  checkHealth(): { message: string } {
    return { message: `Hello, you have just arrived at ${process.env.APPLICATION_NAME} BFF server.` }
  }
}
