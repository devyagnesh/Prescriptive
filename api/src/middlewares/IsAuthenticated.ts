/* eslint-disable @typescript-eslint/no-misused-promises */
/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable no-useless-return */
import { type NextFunction, type Request, type Response } from 'express'
import jwt, { JsonWebTokenError, type JwtPayload } from 'jsonwebtoken'
import { httpStatusCodes } from '../constants/StatusCodes'
import { ThrowException } from '../utils/Errors'
import { Messages } from '../constants/Messages'
import { User } from '../model/User.model'

interface IRequest extends Request {
  user?: string
  token?: string
}

export const IsAuthenticated = async (req: IRequest, _res: Response, next: NextFunction): Promise<void> => {
  try {
    const header = req.headers.authorization

    if (header === null || header === undefined) {
      ThrowException(httpStatusCodes.CLIENT_ERROR.FORBIDDEN, Messages.name.FORBIDDEN, Messages.warning.UN_AUTHORIZED, false)
    }
    const token = header?.split(' ')[1]

    if (token === null || token === undefined) {
      ThrowException(httpStatusCodes.CLIENT_ERROR.FORBIDDEN, Messages.name.FORBIDDEN, Messages.warning.UN_AUTHORIZED, false)
    }

    try {
      const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET!
      const decoded: JwtPayload = jwt.verify(token, REFRESH_TOKEN_SECRET) as JwtPayload

      const user = await User.findOne({ _id: decoded.uid }).exec()

      if (user === undefined || user === null) {
        ThrowException(httpStatusCodes.CLIENT_ERROR.FORBIDDEN, Messages.name.FORBIDDEN, Messages.warning.UN_AUTHORIZED, false)
        return
      }

      req.user = user._id
      req.token = token
      next()
    } catch (error) {
      if (error instanceof JsonWebTokenError) {
        ThrowException(httpStatusCodes.CLIENT_ERROR.FORBIDDEN, Messages.name.FORBIDDEN, Messages.warning.UN_AUTHORIZED, true)
      }
    }
  } catch (error) {
    next(error)
  }
}
