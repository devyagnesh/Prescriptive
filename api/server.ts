/* eslint-disable import/first */
import * as dotenv from 'dotenv'
dotenv.config()
import http from 'http'
import { app } from './src/app'
import { createLogger } from './src/utils/logger'
const server = http.createServer(app)
const PORT: number = Number(process.env.PORT ?? 5000)

server.listen(PORT, () => {
  createLogger('info').info(`SERVER IS UP ON PORT : ${PORT}`)
  console.log(`SERVER IS UP ON PORT : ${PORT}`)
})
