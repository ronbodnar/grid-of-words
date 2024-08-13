import winston from "winston";

const consoleTransport = new winston.transports.Console({
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.splat(),
    winston.format.simple()
  ),
});

const errorTransport = new winston.transports.File({
  level: "error",
  filename: `${process.cwd()}/logs/error.log`,
});

const outputTransport = new winston.transports.File({
  level: "info",
  filename: `${process.cwd()}/logs/output.log`,
});

export const logger = winston.createLogger({
  level: "debug",
  transports: [],
  format: winston.format.json(),
});

// Add File transports for production environments and console transport for development.
if (process.env.NODE_ENV === "production") {
  logger.add(errorTransport).add(outputTransport);
} else if (process.env.NODE_ENV === "development") {
  logger.add(consoleTransport);
}

export default logger;
