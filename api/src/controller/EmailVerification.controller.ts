/* eslint-disable eqeqeq */
/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { type NextFunction, type Request, type Response } from 'express'
import jwt, { type JwtPayload } from 'jsonwebtoken'
import { EmailVerification } from '../model/EmailVerification.model'
import { User } from '../model/User.model'
import { ThrowException } from '../utils/Errors'
import { httpStatusCodes } from '../constants/StatusCodes'
import { Messages } from '../constants/Messages'
import { Validator } from '../libs/Validators'
import CreateQueue from '../services/Queue/CreateQueue'
import verifyEmail from '../templates/VerifyEmail'
import { Helper } from '..//libs/Helper'

const emailQueue = CreateQueue.getInstance().addTaskToQueue('email-queue')
export const ResendEmail = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
  try {
    interface IBody {
      email: string
    }

    const { email }: IBody = req.body

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
    }
    const user = await User.findOne({ email })

    if (user === null || user === undefined) {
      ThrowException(httpStatusCodes.CLIENT_ERROR.NOT_FOUND, Messages.name.NOT_FOUND, Messages.warning.ACCOUNT_NOT_EXISTS)
      return
    }

    const isEmailVerified: boolean = Boolean(user?.isEmailVerified)

    if (isEmailVerified) {
      ThrowException(httpStatusCodes.CLIENT_ERROR.BAD_REQUEST, Messages.name.BAD_REQUEST, Messages.informational.EMAIL_VERIFIED)
      return
    }
    // store token in document
    const FourDigitToken = Helper.generateUniqueNumber()

    const VerificationToken = await new EmailVerification({
      token: jwt.sign({
        email,
        vtoken: FourDigitToken
      }, process.env.JWT_EMAIL_SECRET!)
    }).save()
    user.emailVerification = VerificationToken._id
    await user.save()

    await emailQueue.add(email, {
      to: email,
      html: verifyEmail(FourDigitToken)
    })

    return res.status(httpStatusCodes.SUCCESSFUL.CREATED).json({
      code: httpStatusCodes.SUCCESSFUL.OK,
      name: Messages.name.ACCEPTED,
      message: Messages.informational.VERIRIFICATION_LINK_SEND,
      token: VerificationToken.token
    })
  } catch (error) {
    next(error)
  }
}

export const confirmEmail = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
  try {
    const { token, code } = req.body

    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    const payload: JwtPayload | null = jwt.decode(token) as JwtPayload
    if (payload === undefined || payload === null) {
      ThrowException(httpStatusCodes.CLIENT_ERROR.BAD_REQUEST, Messages.name.BAD_REQUEST, Messages.warning.VERIFICATION_LINK_EXPIRE)
      return
    }

    if ((code == undefined) || code === '') {
      ThrowException(httpStatusCodes.CLIENT_ERROR.BAD_REQUEST, Messages.name.BAD_REQUEST, Messages.warning.VERIFICATION_TOKEN_REQUIRED)
      return
    }
    const findUser = await User.findOne({ email: 'email' in payload ? payload.email : '' }).populate('emailVerification').exec()
    if (findUser?.isEmailVerified === true) {
      ThrowException(httpStatusCodes.CLIENT_ERROR.BAD_REQUEST, Messages.name.BAD_REQUEST, Messages.informational.EMAIL_VERIFIED)
      return
    }
    if (findUser?.emailVerification === undefined || findUser.emailVerification === null || findUser === undefined) {
      console.log('came here')
      ThrowException(httpStatusCodes.CLIENT_ERROR.BAD_REQUEST, Messages.name.BAD_REQUEST, Messages.warning.VERIFICATION_LINK_EXPIRE)
      return
    }

    const storedPayload: JwtPayload | null = jwt.decode(findUser.emailVerification?.token as string) as JwtPayload
    if (Number(storedPayload.vtoken) !== Number(code)) {
      ThrowException(httpStatusCodes.CLIENT_ERROR.BAD_REQUEST, Messages.name.BAD_REQUEST, Messages.warning.VERIFICATION_LINK_EXPIRE)
      return
    }
    findUser.isEmailVerified = true
    await findUser.save()
    return res.status(httpStatusCodes.SUCCESSFUL.ACCEPTED).json({
      code: httpStatusCodes.SUCCESSFUL.OK,
      name: Messages.name.ACCEPTED,
      message: Messages.informational.VERIFIED_EMAIL
    })
  } catch (error) {
    next(error)
  }
}
