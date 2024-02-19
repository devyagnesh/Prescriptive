export class Errors extends Error {
  code: number
  extra: any
  isCritical: boolean

  // eslint-disable-next-line @typescript-eslint/no-useless-constructor
  constructor (code: number, name: string, message: string, isCritical: boolean, extra?: any) {
    super(message)
    Object.setPrototypeOf(this, new.target.prototype)

    this.code = code
    this.name = name
    this.message = message
    this.isCritical = isCritical
    this.extra = extra
    Error.captureStackTrace(this, this.constructor)
  }
}

export function ThrowException (code: number, name: string, message: string, isCritical: boolean, extra?: any): void {
  throw new Errors(code, name, message, isCritical, extra)
}
