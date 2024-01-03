import mongoose from 'mongoose'
import { createLogger } from '../utils/logger'

const MONGODB_URI: string = process.env.MONGO_URI ?? ''

export async function connectToDatabase (): Promise<void> {
  try {
    await mongoose.connect(MONGODB_URI, {
      bufferCommands: false,
      connectTimeoutMS: 10000,
      serverSelectionTimeoutMS: 5000
    })
    createLogger('info').info('Connected to MongoDB database')
  } catch (error) {
    createLogger('error').error('Error connecting to MongoDB:', error)
    process.exit(1)
  }
}
