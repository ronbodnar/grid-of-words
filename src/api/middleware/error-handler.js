import logger from "../config/winston.config.js";

const errorHandler = (err, req, res, next) => {
  if (err.name === "Unauthorized") {
    console.log("Unauthorized");
    return res.status(401).json({
      status: "error",
      message: "Invalid credentials.",
    });
  }

  // General error handling
  logger.error(err);
  res.status(500).json({
    message: "Internal Server Error",
    error: process.env.NODE_ENV === "development" ? err.stack : {},
  });
};

export default errorHandler;