import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import cookieParser from 'cookie-parser'
import { connectToDatabase } from './config/Database'
import { errorHandler } from './middlewares/ErrorHandler'
import AuthRoute from './routes/auth.routes'
import EmailRoute from './routes/emailVerification.routes'
import CreateQueue from './services/Queue/CreateQueue'

export const app = express()

app.use(helmet())
app.use(cors())
app.use(express.json())
app.use(cookieParser())
void connectToDatabase()

app.use('/api/v1/auth', AuthRoute)
app.use('/api/v1/verification', EmailRoute)
// eslint-disable-next-line @typescript-eslint/no-misused-promises
app.get('/api/test', async (): Promise<any> => {
  try {
    const myqueue = CreateQueue.getInstance().addTaskToQueue('sms-queue')
    await myqueue.add(Date.now().toString(), {
      to: 'whatsapp:+919265611501',
      message: 'this message is coming from prescriptive api'
    })

    return { statsu: true }
  } catch (error) {
    console.log('SMS ERROR : ', error)
  }
})
/**
 * handle errors occurs in application
 */
app.use(errorHandler)
