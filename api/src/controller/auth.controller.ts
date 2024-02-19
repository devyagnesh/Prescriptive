/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { type Response, type Request, type NextFunction } from 'express'
import jwt from 'jsonwebtoken'
import { httpStatusCodes } from '../constants/StatusCodes'
import { Validator } from '../libs/Validators'
import { ThrowException } from '../utils/Errors'
import { Messages } from '../constants/Messages'
import { User } from '../model/User.model'
import { EmailVerification } from '../model/EmailVerification.model'
import verifyEmail from '../templates/VerifyEmail'
import CreateQueue from '../services/Queue/CreateQueue'
import { Helper } from '../libs/Helper'

const emailQueue = CreateQueue.getInstance().addTaskToQueue('email-queue')

export const Signup = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<any> => {
  try {
    interface IBody {
      fullname: string
      email: string
      password: string
      confirmPassword: string
    }

    const { fullname, email, password, confirmPassword }: IBody = req.body

    if (
      Validator.isEmpty(fullname) ||
      !Validator.hasValidLength(fullname, 3) ||
      !Validator.isAlphabetic(fullname, true)
    ) {
      ThrowException(
        httpStatusCodes.CLIENT_ERROR.BAD_REQUEST,
        Messages.name.BAD_REQUEST,
        Messages.warning.INVALID_FULLNAME,
        {
          posibilities: {
            isEmpty: true,
            hasValidLength: false
          }
        }
      )
      return
    } else if (Validator.isEmpty(email) || !Validator.isValidEmail(email)) {
      ThrowException(
        httpStatusCodes.CLIENT_ERROR.BAD_REQUEST,
        Messages.name.BAD_REQUEST,
        Messages.warning.INVALID_EMAIL,
        {
          posibilities: {
            isEmpty: true,
            isValidEmail: false
          }
        }
      )
      return
    } else if (
      Validator.isEmpty(password) ||
      !Validator.hasValidLength(password, 8)
    ) {
      ThrowException(
        httpStatusCodes.CLIENT_ERROR.BAD_REQUEST,
        Messages.name.BAD_REQUEST,
        Messages.warning.SHORT_PASSWORD,
        {
          posibilities: {
            isEmpty: true,
            hasValidLength: false
          }
        }
      )
      return
    } else if (
      Validator.isEmpty(confirmPassword) ||
      !Validator.compare(confirmPassword, password)
    ) {
      ThrowException(
        httpStatusCodes.CLIENT_ERROR.BAD_REQUEST,
        Messages.name.BAD_REQUEST,
        Messages.warning.PASSWORD_NOT_MATCHED,
        {
          posibilities: {
            isEmpty: true,
            hasMatched: false
          }
        }
      )
      return
    } else if ((await User.findOne({ email })) !== null) {
      ThrowException(
        httpStatusCodes.CLIENT_ERROR.BAD_REQUEST,
        Messages.name.BAD_REQUEST,
        Messages.informational.EMAIL_EXISTS
      )
      return
    }

    const user = new User({
      fullname,
      email,
      password
    })
    const { user: newuser, token } = await user.generateRefreshToken()

    const FourDigitToken = Helper.generateUniqueNumber()
    const verificationToken = await new EmailVerification({
      token: jwt.sign({
        email,
        vtoken: FourDigitToken
      }, process.env.JWT_EMAIL_SECRET!)
    }).save()
    user.emailVerification = verificationToken._id
    await newuser.save()
    await emailQueue.add(email, {
      to: email,
      html: verifyEmail(FourDigitToken)
    })
    return res.status(httpStatusCodes.SUCCESSFUL.CREATED).json({
      code: httpStatusCodes.SUCCESSFUL.OK,
      name: Messages.name.ACCEPTED,
      message: Messages.informational.ACCOUNT_CREATED,
      token,
      verificationToken,
      isVerified: user.isEmailVerified
    })
  } catch (error) {
    next(error)
  }
}

export const SignIn = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<any> => {
  try {
    interface IBody {
      email: string
      password: string
    }

    const { email, password }: IBody = req.body
    if (Validator.isEmpty(email) || !Validator.isValidEmail(email)) {
      ThrowException(
        httpStatusCodes.CLIENT_ERROR.BAD_REQUEST,
        Messages.name.BAD_REQUEST,
        Messages.warning.INVALID_EMAIL,
        {
          posibilities: {
            isEmpty: true,
            isValidEmail: false
          }
        }
      )
      return
    } else if (Validator.isEmpty(password)) {
      ThrowException(
        httpStatusCodes.CLIENT_ERROR.BAD_REQUEST,
        Messages.name.BAD_REQUEST,
        Messages.warning.SHORT_PASSWORD,
        {
          posibilities: {
            isEmpty: true
          }
        }
      )
      return
    }
    const user = await User.signin(email, password)
    if (user === null) {
      ThrowException(
        httpStatusCodes.CLIENT_ERROR.BAD_REQUEST,
        Messages.name.BAD_REQUEST,
        Messages.warning.INVALID_CREDENTIALS,
        {
          posibilities: {
            isEmpty: true,
            isValidEmail: false
          }
        }
      )
      return
    }
    const token = await user.generateRefreshToken()
    return res.status(httpStatusCodes.SUCCESSFUL.CREATED).json({
      code: httpStatusCodes.SUCCESSFUL.OK,
      name: Messages.name.ACCEPTED,
      message: Messages.informational.LOGGED_IN,
      token: token.token,
      isVerified: user.isEmailVerified
    })
  } catch (error) {
    next(error)
  }
}
