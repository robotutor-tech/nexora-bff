import { Controller, Get, Injectable } from '@nestjs/common'

@Controller('healthcheck')
export class HealthcheckController {
  @Get()
  checkHealth(): { message: string } {
    return { message: 'Hello, you have just arrived at Mock Backend server.' }
  }
}
