import { Router } from 'express'
import { ResendEmail, confirmEmail } from '../controller/EmailVerification.controller'

const route = Router()

// eslint-disable-next-line @typescript-eslint/no-misused-promises
route.post('/resend', ResendEmail).get('/verify/:token', confirmEmail)
export default route
