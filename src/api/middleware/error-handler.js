import logger from "../config/winston.config.js"

/**
 * The default error handler that will build an informative response for the client with the proper status code and log the details.
 */
// eslint-disable-next-line
const errorHandler = (err, req, res, next) => {
  // The default error if an invalid error is encountered.
  const defaultError = new Error("Something went wrong.", {
    error: err,
  })

  err = err || defaultError

  const {
    name,
    data,
    message = defaultError.message,
    statusCode = 500,
    stack,
  } = err

  const loggerData = {
    name: name,
    message: message,
    data: data,
    stack: stack,
  }
  const showLoggerData = name !== "ValidationError"
  logger.error(
    `Error Handler middleware was passed an error`,
    showLoggerData ? loggerData : undefined
  )

  // Send the error response to the client.
  return res.status(err.statusCode).json({
    message: message,
    statusCode: statusCode,
    stack: process.env.NODE_ENV === "development" ? stack : undefined,
  })
}

export default errorHandler
