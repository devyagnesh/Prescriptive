/* eslint-disable no-useless-catch */
import nodemailer, { type Transporter } from 'nodemailer'
import { Messages } from '../constants/Messages'
import { IEmailVerify, IMail } from '../Interfaces/Mail.interface'



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

  private async sendMail (
    options: IMail
  ): Promise<any> {
    if (!await this.verifyTransporter()) {
      throw new Error('transport verification failed')
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

  async sendEmailVerificationMail (to: string,html: IEmailVerify): Promise<any> {
    return await this.sendMail({
    
      from: process.env.SMTP_SENDER!,
      to,
      subject: Messages.MAIL_VERIFICATION_SUBJECT,
      html: html.html
    })
  }
}
