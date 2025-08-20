import { Injectable, NestMiddleware } from '@nestjs/common'
import { NextFunction, Request, Response } from 'express'
import logger from 'logging-starter'

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction): void {
    const startTime = new Date()
    const searchableFields = { 'x-trace-id': req.app.locals.traceId as string }
    logger.request({
      message: 'Received Request',
      method: req.method,
      url: req.url,
      searchableFields
    })
    const send = res.send
    let isLogged = false
    res.send = function (data: Record<string, unknown>) {
      const responseTime: number = new Date().getTime() - startTime.getTime()
      if (!isLogged) {
        logger.response({
          message: 'Response for the request',
          method: req.method,
          url: req.url,
          statusCode: res.statusCode,
          responseTime,
          searchableFields
        })
        isLogged = true
      }
      // eslint-disable-next-line @typescript-eslint/no-unsafe-return
      return send.call(this, data)
    }
    next()
  }
}
