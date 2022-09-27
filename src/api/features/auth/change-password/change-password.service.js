import InternalError from "../../../errors/InternalError.js"
import UnauthorizedError from "../../../errors/UnauthorizedError.js"
import ValidationError from "../../../errors/ValidationError.js"
import { findUserBy } from "../../user/user.repository.js"
import {
  generateSalt,
  hashPassword,
  verifyJWT,
} from "../authentication.service.js"

/**
 * Changes the user's password after validating the current password and authentication token.
 *
 * @async
 * @param {Object} [optionList={}] - Options for changing the password.
 * @param {string} optionList.newPassword - The new password to set.
 * @param {string} optionList.currentPassword - The current password of the user.
 * @param {string} optionList.authToken - The authentication token for verifying the user.
 * @param {string} optionList.userId - The ID of the user requesting the password change.
 * @returns {Promise<Object|ValidationError|UnauthorizedError>} A success object or an error if validation fails.
 */
export const changePassword = async (options = {}) => {
  const { newPassword, currentPassword, authToken, userId } = options

  if (newPassword === currentPassword) {
    return new ValidationError(
      "New password cannot be the same as the current password."
    )
  }

  if (newPassword.length < 8) {
    return new ValidationError(
      "New password must be at least 8 characters long."
    )
  }

  const tokenData = await verifyJWT(authToken)
  if (!tokenData?.data) {
    return new UnauthorizedError("User is not authenticated.")
  }

  const { _id } = tokenData.data

  if (_id !== userId) {
    return new UnauthorizedError(
      "You are not authorized to change this password."
    )
  }

  const authenticatedUser = await findUserBy("_id", _id)
  if (!authenticatedUser) {
    return new UnauthorizedError(
      "Please log out and back in to change your password."
    )
  }

  const salt = authenticatedUser.getSalt()
  const actualPasswordHash = authenticatedUser.getHash()
  const providedPasswordHash = hashPassword(currentPassword, salt)

  if (actualPasswordHash !== providedPasswordHash) {
    return new UnauthorizedError(
      "The current password you provided is not correct."
    )
  }

  const newSalt = generateSalt()
  const newPasswordHash = newSalt + hashPassword(newPassword, newSalt)
  const savedSuccessfully = authenticatedUser.save({
    hash: newPasswordHash,
  })

  if (!savedSuccessfully || savedSuccessfully instanceof ValidationError) {
    const error =
      savedSuccessfully ||
      new InternalError("Failed to save the user when changing password.")
    return error
  }

  return {
    status: "success",
    message: "Password changed successfully.",
  }
}
