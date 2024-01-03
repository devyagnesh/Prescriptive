import { type Request, type Response, type NextFunction } from 'express'
import { Messages } from '../constants/Messages'
import { httpStatusCodes } from '../constants/StatusCodes'
import { createLogger } from '../utils/logger'
import { type Errors } from '../utils/Errors'

export function errorHandler (_err: Errors, req: Request, res: Response, next: NextFunction): Response {
  createLogger('error').error({
    ..._err
  })
  return res.status(_err.code ?? 500).json({
    code: _err.code ?? httpStatusCodes.SERVER_ERROR.INTERNAL_SERVER_ERROR,
    name: _err.name ?? Object.keys(httpStatusCodes)[4],
    message: _err.message ?? Messages.error.INTERNAL_SERVER_ERROR,
    extra: _err.extra
  })
}
