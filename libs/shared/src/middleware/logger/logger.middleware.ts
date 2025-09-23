import { Injectable, Logger, NestMiddleware } from '@nestjs/common'
import { NextFunction, Request, Response } from 'express'

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  private readonly logger = new Logger(this.constructor.name)
  use(req: Request, res: Response, next: NextFunction): void {
    const startTime = new Date()
    const searchableFields = { 'x-trace-id': req.app.locals.traceId as string }
    this.logger.log(
      `Received Request ${JSON.stringify({
        method: req.method,
        url: req.url,
        searchableFields
      })}`
    )
    const send = res.send
    let isLogged = false
    res.send = function (data: Record<string, unknown>) {
      const responseTime: number = new Date().getTime() - startTime.getTime()
      const logger = new Logger(LoggerMiddleware.name)
      if (!isLogged) {
        logger.log(
          `Response for the request ${JSON.stringify({
            method: req.method,
            url: req.url,
            statusCode: res.statusCode,
            responseTime,
            searchableFields
          })}`
        )
        isLogged = true
      }
      // eslint-disable-next-line @typescript-eslint/no-unsafe-return
      return send.call(this, data)
    }
    next()
  }
}
