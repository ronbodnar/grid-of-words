/**
 * Creates a logger with various logging levels and functions.
 *
 * @returns {Object} An object containing logging functions and the LogLevel mapping.
 */
const logger = () => {
  const LogLevel = {
    FATAL: 1,
    ERROR: 2,
    WARN: 3,
    INFO: 4,
    DEBUG: 5,
    TRACE: 6,
  }

  /**
   * Logs a message with a specified log level.
   *
   * @param {number} level The log level from LogLevel enum.
   * @param {string} message The message to log.
   * @param {...*} args Additional arguments to log.
   */
  const log = (level, message, ...args) => {
    // temporarily disable logging for debug/trace
    if (level > LogLevel.INFO) {
      //return;
    }
    console.log(
      `[${Object.keys(LogLevel).find((key) => LogLevel[key] === level)}]`,
      message,
      ...args
    )
  }

  const trace = (message, ...args) => log(LogLevel.TRACE, message, ...args)
  const debug = (message, ...args) => log(LogLevel.DEBUG, message, ...args)
  const info = (message, ...args) => log(LogLevel.INFO, message, ...args)
  const warn = (message, ...args) => log(LogLevel.WARN, message, ...args)
  const error = (message, ...args) => log(LogLevel.ERROR, message, ...args)
  const fatal = (message, ...args) => log(LogLevel.FATAL, message, ...args)

  // Return an object containing all logging functions and the LogLevel mapping.
  return {
    log,
    trace,
    debug,
    info,
    warn,
    error,
    fatal,
    LogLevel,
  }
}

export default logger
