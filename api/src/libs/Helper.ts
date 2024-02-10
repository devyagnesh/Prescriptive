// eslint-disable-next-line @typescript-eslint/no-extraneous-class
export class Helper {
  static generateUniqueNumber (): number {
    const uniqueNumber = Math.floor(Math.random() * 9000 + 1000)
    return uniqueNumber
  }
}
