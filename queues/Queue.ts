import dotenv from 'dotenv'
dotenv.config({})
import {emailWorker} from './src/email-queue'
import { smsWorker } from './src/sms-queue'
emailWorker
smsWorker