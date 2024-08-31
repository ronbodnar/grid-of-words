import UnauthorizedError from "../../../errors/UnauthorizedError.js"
import ValidationError from "../../../errors/ValidationError.js"
import { findUserBy } from "../../user/user.repository.js"
import { generateSalt, hashPassword } from "../authentication.service.js"

/**
 * Attempts to reset the password for a {@link User} and updates the password in the database if successful.
 *
 * @async
 * @param {string} newPassword The new password for the user account.
 * @param {string} passwordResetToken The password reset token to validate the password reset.
 * @returns {Promise<Object|ValidationError|UnauthorizedError>} A promise that resolves to an object with a success message if successful.
 */
export const resetPassword = async (newPassword, passwordResetToken) => {
  if (newPassword.length < 8) {
    return new ValidationError(
      "New password must be at least 8 characters long."
    )
  }

  const authenticatedUser = await findUserBy(
    "passwordResetToken",
    passwordResetToken
  )
  if (!authenticatedUser) {
    return new UnauthorizedError("The password reset token is invalid.")
  }

  // Generate a new salt and hash the new password + preprend the hash with the salt.
  const newSalt = generateSalt()
  const newPasswordHash = newSalt + hashPassword(newPassword, newSalt)

  await authenticatedUser.save({
    hash: newPasswordHash,
    passwordResetToken: null,
    passwordResetTokenExpiration: null,
  })

  return {
    message: "Password reset successfully.",
  }
}
