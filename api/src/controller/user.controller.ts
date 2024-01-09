/* eslint-disable no-useless-return */
import { type NextFunction, type Request, type Response, Router } from 'express'
const route = Router()

export const updateUser = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
  try {
    console.log('hello world')
  } catch (error) {
    next(error)
    return
  }
}
module.exports = route
