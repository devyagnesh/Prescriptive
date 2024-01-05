/* eslint-disable eqeqeq */
/* eslint-disable @typescript-eslint/no-non-null-assertion */
import crypto from 'crypto'
import { type NextFunction, type Request, type Response } from 'express'
import jwt, { type JwtPayload } from 'jsonwebtoken'
import { EmailVerification } from '../model/EmailVerification.model'
import { User } from '../model/User.model'
import { ThrowException } from '../utils/Errors'
import { httpStatusCodes } from '../constants/StatusCodes'
import { Messages } from '../constants/Messages'
import MailService from '../services/SendMail'
import verifyEmail from '../templates/VerifyEmail'
import { Validator } from '../libs/Validators'

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
    const VerificationToken = await new EmailVerification({
      token: jwt.sign({
        email,
        vtoken: crypto.randomBytes(32).toString('hex')
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      }, process.env.JWT_EMAIL_SECRET!)
    }).save()
    user.emailVerification = VerificationToken._id
    await user.save()
    const mailService = MailService.getInstance()
    const emailVerificationUrl = `http://${req.hostname}:${process.env.PORT}/api/v1/verification/verify/${VerificationToken.token}`

    await mailService.sendMail({
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      from: process.env.SMTP_SENDER!,
      to: email,
      subject: Messages.informational.VERIFY_YOUR_EMAIL,
      html: verifyEmail(emailVerificationUrl).html
    })

    return res.status(httpStatusCodes.SUCCESSFUL.CREATED).json({
      code: httpStatusCodes.SUCCESSFUL.OK,
      name: Messages.name.ACCEPTED,
      message: Messages.informational.VERIRIFICATION_LINK_SEND

    })
  } catch (error) {
    next(error)
  }
}

export const confirmEmail = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
  try {
    const { token } = req.params

    const payload: JwtPayload | null = jwt.decode(token) as JwtPayload

    if (payload === undefined || payload === null) {
      ThrowException(httpStatusCodes.CLIENT_ERROR.BAD_REQUEST, Messages.name.BAD_REQUEST, Messages.warning.VERIFICATION_LINK_EXPIRE)
      return
    }

    const findUser = await User.findOne({ email: 'email' in payload ? payload.email : '' }).populate('emailVerification').exec()

    if (findUser?.isEmailVerified === true) {
      ThrowException(httpStatusCodes.CLIENT_ERROR.BAD_REQUEST, Messages.name.BAD_REQUEST, Messages.informational.EMAIL_VERIFIED)
      return
    }
    if (findUser?.emailVerification === undefined || findUser.emailVerification === null || findUser === undefined) {
      ThrowException(httpStatusCodes.CLIENT_ERROR.BAD_REQUEST, Messages.name.BAD_REQUEST, Messages.warning.VERIFICATION_LINK_EXPIRE)
      return
    }

    const storedPayload: JwtPayload | null = jwt.decode(findUser.emailVerification?.token as string) as JwtPayload
    if (storedPayload.vtoken !== payload.vtoken) {
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
