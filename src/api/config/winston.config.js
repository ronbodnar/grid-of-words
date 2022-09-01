import winston from "winston"

const consoleTransport = new winston.transports.Console({
  format: winston.format.combine(
    winston.format.colorize(),
    winston.format.timestamp(),
    winston.format.printf((info) => {
      const { level, timestamp, message, ...meta } = info
      const metaString = Object.keys(meta).length
        ? JSON.stringify(meta, null, 4)
        : ""
      return `${timestamp} [${level}] ${message}${
        metaString ? `\n${metaString}` : ""
      }`
    })
  ),
})

const errorTransport = new winston.transports.File({
  level: "error",
  filename: `${process.cwd()}/logs/error.log`,
})

const outputTransport = new winston.transports.File({
  level: "info",
  filename: `${process.cwd()}/logs/output.log`,
})

export const logger = winston.createLogger({
  level: "debug",
  transports: [],
  format: winston.format.json(),
})

const { NODE_ENV } = process.env
// Add File transports for production environments and console transport for development.
if (NODE_ENV === "production") {
  logger.add(errorTransport).add(outputTransport)
} else if (NODE_ENV === "development") {
  logger.add(consoleTransport)
}

export default logger
