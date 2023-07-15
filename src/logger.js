const { createLogger, format, transports, log } = require('winston')
const chalk = require('chalk')

const { combine, printf, timestamp } = format

const lFormat = printf(({ level, message, timestamp }) => {
  const str = `${timestamp} ${level.toUpperCase()}: ${message}`

  if (level === 'info') {
    return chalk.green(str)
  } else if (level === 'error') {
    return chalk.red(str)
  } else {
    return chalk.grey(str)
  }
})

const logger = createLogger({
  level: 'debug',
  format: combine(format.splat(), timestamp(), lFormat),
  transports: [new transports.Console()],
})

logger.stream({
  write: t => {
    logger.info(t)
  },
})

module.exports = logger
