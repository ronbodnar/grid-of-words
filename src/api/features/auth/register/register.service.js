import logger from "../../../config/winston.config.js"
import { EMAIL_REGEX, USERNAME_REGEX } from "../../../shared/constants.js"
import InternalError from "../../../errors/InternalError.js"
import ValidationError from "../../../errors/ValidationError.js"
import { findUserBy, insertUser } from "../../user/user.repository.js"
import User from "../../user/User.js"

/**
 * Attempts to register a new {@link User} by validating input and saving the new user to the database.
 *
 * @async
 * @param {string} username The username for the new user.
 * @param {string} email The email address for the new user.
 * @param {string} password The password for the new user.
 * @returns {Promise<Object|ValidationError|InternalError>} A promise that resolves to an object with a success message.
 */
export const registerUser = async (username, email, password) => {
  if (!USERNAME_REGEX.test(username)) {
    return new ValidationError(
      "Username must be 3-16 characters long.\r\nNo symbols other than - and _ allowed."
    )
  }

  if (!EMAIL_REGEX.test(email)) {
    return new ValidationError("Email address is not valid")
  }

  if (password.length < 8) {
    return new ValidationError("Password must be at least 8 characters long")
  }

  const dbUser = await findUserBy("email", email)
  if (dbUser) {
    // TODO: This is a potential security risk for users (exposing who uses the app)
    return new ValidationError("Email address is already registered")
  }

  const user = new User({
    email,
    username,
    password,
  })
  const insertResult = await insertUser(user)
  if (!insertResult) {
    return new InternalError("Failed to insert new user into the database", {
      user: user,
    })
  }

  logger.info("Successfully registered a new user", {
    email: email,
    username: username,
  })

  return {
    message: "Registration successful",
  }
}
