export class Errors extends Error {
  code: number
  extra: any
  // eslint-disable-next-line @typescript-eslint/no-useless-constructor
  constructor (code: number, name: string, message: string, extra?: any) {
    super(message)
    Object.setPrototypeOf(this, new.target.prototype)

    this.code = code
    this.name = name
    this.message = message
    this.extra = extra
    Error.captureStackTrace(this, this.constructor)
  }
}

export function ThrowException (code: number, name: string, message: string, extra?: any): void {
  throw new Errors(code, name, message, extra)
}
