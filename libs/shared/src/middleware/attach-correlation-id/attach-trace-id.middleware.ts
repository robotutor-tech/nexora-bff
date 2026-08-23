import { Injectable, NestMiddleware } from '@nestjs/common'
import { randomUUID } from 'node:crypto'
import { NextFunction, Request, Response } from 'express'

export const CORRELATION_ID = 'x-correlation-id'

@Injectable()
export class AttachTraceIdMiddleware implements NestMiddleware {
  use(req: Request, _res: Response, next: NextFunction): void {
    req.headers[CORRELATION_ID] = randomUUID()
    next()
  }
}
