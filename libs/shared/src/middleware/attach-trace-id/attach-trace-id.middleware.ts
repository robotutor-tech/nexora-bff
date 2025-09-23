import { Injectable, Logger, NestMiddleware } from '@nestjs/common'
import { randomUUID } from 'node:crypto'
import { NextFunction, Response, Request } from 'express'
import * as process from 'node:process'

@Injectable()
export class AttachTraceIdMiddleware implements NestMiddleware {
  private readonly logger = new Logger(this.constructor.name)
  use(req: Request, _res: Response, next: NextFunction): void {
    req.app.locals.traceId = `${process.env.APPLICATION_NAME}:${randomUUID().toString()}`
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    req.headers['x-trace-id'] = req.app.locals.traceId
    next()
  }
}
