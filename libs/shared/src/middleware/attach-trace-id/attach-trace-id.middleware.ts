import { Injectable, NestMiddleware } from '@nestjs/common'
import { randomUUID } from 'node:crypto'
import { NextFunction, Response, Request } from 'express'

@Injectable()
export class AttachTraceIdMiddleware implements NestMiddleware {
  use(req: Request, _res: Response, next: NextFunction): void {
    req.app.locals.traceId = `rest-iot-${randomUUID().toString()}`
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    req.headers['x-trace-id'] = req.app.locals.traceId
    next()
  }
}
