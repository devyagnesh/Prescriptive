/* eslint-disable no-useless-catch */
import nodemailer, { type Transporter } from 'nodemailer'
import { ThrowException } from '../utils/Errors'
import { httpStatusCodes } from '../constants/StatusCodes'
import { Messages } from '../constants/Messages'

interface MailInterface {
  from: string
  to: string
  subject: string
  text?: string
  html?: string
}

export default class MailService {
  private static instance: MailService
  private transporter: Transporter

  private constructor () {
    this.transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST ?? '',
      port: Number(process.env.SMTP_PORT),
      secure: Boolean(process.env.SMTP_TLS),
      auth: {
        user: process.env.SMTP_USERNAME,
        pass: process.env.SMTP_PASSWORD
      }
    })
  }

  static getInstance (): MailService {
    if (MailService.instance === null || MailService.instance === undefined) {
      MailService.instance = new MailService()
    }
    return MailService.instance
  }

  private async verifyTransporter (): Promise<boolean> {
    try {
      return await this.transporter.verify()
    } catch (error) {
      throw error
    }
  }

  async sendMail (
    options: MailInterface
  ): Promise<any> {
    if (!await this.verifyTransporter()) {
      ThrowException(httpStatusCodes.SERVER_ERROR.INTERNAL_SERVER_ERROR, Messages.name.INTERNAL_SERVER_ERROR, Messages.error.INTERNAL_SERVER_ERROR)
    }
    const information = await this.transporter.sendMail({
      from: options.from,
      to: options.to,
      subject: options.subject,
      text: options.text,
      html: options.html
    })

    return information
  }
}
