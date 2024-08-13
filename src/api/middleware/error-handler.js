import logger from "../config/winston.config.js";

/**
 * The default error handler that will build an informative response to the server with the proper status code.
 */
const errorHandler = (err, req, res, next) => {
  // The default error if an invalid error is encountered.
  const defaultError = new Error("Something went wrong.");

  // Set up the missing error properties with default values
  err = err || defaultError;
  err.message = err.message || defaultError.message;
  err.statusCode = err.statusCode || 500;

  // Temporarily pass everything to the logger.
  // TODO: pass error types to logger functions
  logger.error(err);

  // Send the error response to the client.
  res.status(err.statusCode).json({
    message: err.message,
    statusCode: err.statusCode,
    stack: process.env.NODE_ENV === "development" ? err.stack : undefined,
  });
};

export default errorHandler;
