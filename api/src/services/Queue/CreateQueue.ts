import { Queue } from 'bullmq'

export default class CreateQueue {
  private host: string | undefined
  private port: number | undefined
  private username: string | undefined
  private password: string | undefined
  private static instance: CreateQueue

  private constructor () {
    this.host = process.env.REDIS_HOST
    this.port = Number(process.env.REDIS_PORT)
    this.username = process.env.REDIS_USER
    this.password = process.env.REDIS_PASSWORD
  }

  public static getInstance (): CreateQueue {
    if (CreateQueue.instance === undefined || CreateQueue.instance === null) {
      CreateQueue.instance = new CreateQueue()
    }
    return CreateQueue.instance
  }

  public addTaskToQueue (name: string): Queue {
    // eslint-disable-next-line no-new
    return new Queue(name, {
      connection: {
        host: this.host,
        port: this.port,
        username: this.username,
        password: this.password
      }
    })
  }
}
