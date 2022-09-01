class BaseError extends Error {
  constructor(name, statusCode, message, data) {
    super(message)
    if (typeof data === "object") {
      this.data = JSON.stringify(data)
    } else {
      this.data = data
    }
    this.name = name
    this.statusCode = statusCode
  }
}

export default BaseError
