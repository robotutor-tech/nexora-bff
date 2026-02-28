import { Injectable, Logger, NestMiddleware } from '@nestjs/common'
import { randomUUID } from 'node:crypto'
import { NextFunction, Response, Request } from 'express'

@Injectable()
export class AttachTraceIdMiddleware implements NestMiddleware {
  use(req: Request, _res: Response, next: NextFunction): void {
    req.app.locals.correlationId = randomUUID()
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    req.headers['correlation-id'] = req.app.locals.corerlationId
    Logger.log(`Request body for ${req.url}`)
    next()
  }
}
