import winston from "winston";

const consoleTransport = new winston.transports.Console({
  format: winston.format.combine(
    winston.format.splat(),
    winston.format.simple()
  ),
});

const errorTransport = new winston.transports.File({
  filename: "error.log",
  level: "error",
});

const outputTransport = new winston.transports.File({
  filename: "output.log",
  level: "info",
})

export const logger = winston.createLogger({
    level: 'info',
    transports: [],
    format: winston.format.json(),
});

if (process.env.NODE_ENV === "production") {
    logger.add(errorTransport).add(outputTransport);
} else if (process.env.NODE_ENV === "development") {
    logger.add(consoleTransport);
}

export default logger;