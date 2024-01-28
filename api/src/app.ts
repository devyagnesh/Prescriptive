import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import cookieParser from 'cookie-parser'
import { connectToDatabase } from './config/Database'
import { errorHandler } from './middlewares/ErrorHandler'
import AuthRoute from './routes/auth.routes'
import EmailRoute from './routes/emailVerification.routes'

export const app = express()

app.use(helmet())
app.use(cors())
app.use(express.json())
app.use(cookieParser())
void connectToDatabase()

app.use('/api/v1/auth', AuthRoute)
app.use('/api/v1/verification', EmailRoute)
app.use(errorHandler)
