import winston from "winston"
import { ERROR_LOG_FILE, OUTPUT_LOG_FILE } from "../shared/constants.js"

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
  filename: ERROR_LOG_FILE,
})

const outputTransport = new winston.transports.File({
  level: "info",
  filename: OUTPUT_LOG_FILE,
})

export const logger = winston.createLogger({
  level: "debug",
  transports: [],
  format: winston.format.json(),
})

// Add the appropriate Transport(s) to the logger
const { NODE_ENV } = process.env
if (NODE_ENV === "production") {
  logger.add(errorTransport).add(outputTransport)
} else if (NODE_ENV === "development") {
  logger.add(consoleTransport)
}

export default logger
