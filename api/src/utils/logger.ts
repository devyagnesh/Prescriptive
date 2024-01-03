import winston from 'winston'

type levelType = 'error' | 'warn' | 'info' | 'http' | 'verbose' | 'debug' | 'silly'

function createTransport (level: levelType): winston.transport[] | undefined {
  if (level === 'error') {
    return [new winston.transports.File({ filename: 'error.log', level: 'error' })]
  } else if (level === 'info' || level === 'http' || level === 'verbose' || level === 'debug' || level === 'silly') {
    return [new winston.transports.File({ filename: 'app.log', level: 'info' })]
  }

  // Return undefined for unsupported levels to avoid unnecessary logging
  return undefined
}

export function createLogger (level: levelType): winston.Logger {
  const transports = createTransport(level)

  if (transports == null) {
    throw new Error(`Unsupported log level: ${level}`)
  }

  const logger = winston.createLogger({
    level,
    transports
  })

  return logger
}
