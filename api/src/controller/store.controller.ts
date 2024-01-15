/* eslint-disable no-useless-return */
import { type NextFunction, type Request, type Response } from 'express'
import { Messages } from 'src/constants/Messages'
import { httpStatusCodes } from 'src/constants/StatusCodes'
import { Validator } from 'src/libs/Validators'
import { ThrowException } from 'src/utils/Errors'

interface IStoreBody {
  storename: string
  addressLine1: string
  addressLine2?: string
  phoneNumber: string
}

export const createStore = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
  try {
    const { storename, addressLine1, addressLine2, phoneNumber }: IStoreBody = req.body

    if (!Validator.isAlphaNumericWithSpaces(storename) || Validator.isEmpty(storename)) {
      ThrowException(httpStatusCodes.CLIENT_ERROR.BAD_REQUEST, Messages.name.BAD_REQUEST, Messages.warning.INVALID_STORE_NAME, {
        possiblities: {
          isAlphaNumericWithSpaces: true,
          isEmpty: true
        }
      })
      return
    } else if (Validator.isEmpty(addressLine1)) {
      ThrowException(httpStatusCodes.CLIENT_ERROR.BAD_REQUEST, Messages.name.BAD_REQUEST, Messages.warning.INVALID_ADDRESSLINE_1, {
        possiblities: {
          isEmpty: true
        }
      })
    } else if (!Validator.isValidPhoneNumber(phoneNumber) || Validator.isEmpty(phoneNumber)) {
      ThrowException(httpStatusCodes.CLIENT_ERROR.BAD_REQUEST, Messages.name.BAD_REQUEST, Messages.warning.INVALID_PHONE_NUMBER, {
        possiblities: {
          isEmpty: true,
          isInvalidFormat: true
        }
      })
    }
  } catch (error) {
    next(error)
  }
}
