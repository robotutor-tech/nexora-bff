import { Injectable, Logger, NestMiddleware } from '@nestjs/common'
import { NextFunction, Request, Response } from 'express'

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  private readonly logger = new Logger(this.constructor.name)
  use(req: Request, res: Response, next: NextFunction): void {
    const startTime = new Date()
    const searchableFields = { 'correlation-id': req.app.locals.correlationId as string }
    this.logger.log(
      `Received Request ${JSON.stringify({
        method: req.method,
        url: req.url,
        searchableFields
      })}`,
      req.body
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
          })}`,
          data
        )
        isLogged = true
      }
      res.header('response-time', `${responseTime}ms`)
      res.header('correlation-id', req.app.locals.correlationId as string)
      // eslint-disable-next-line @typescript-eslint/no-unsafe-return
      return send.call(this, data)
    }
    next()
  }
}
