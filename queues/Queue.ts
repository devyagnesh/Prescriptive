import dotenv from 'dotenv'
dotenv.config({})
import {emailWorker} from './src/email-queue'
emailWorker