import { All, Controller, Req } from '@nestjs/common'
import { ProxyService } from './proxy.service'
import type { Request } from 'express'
import { Document } from '@shared/types/types'

@Controller()
export class ProxyController {
  constructor(private readonly proxyService: ProxyService) {}

  @All('*path')
  proxy(@Req() req: Request): Promise<Document> {
    return this.proxyService.forward(req)
  }
}
