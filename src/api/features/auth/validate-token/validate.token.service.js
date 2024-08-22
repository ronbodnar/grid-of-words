import { UnauthorizedError } from "../../../errors/index.js";
import userRepository from "../../user/user.repository.js";

/**
 * Validates a password reset token by checking the database for a match and then checking the token expiration date.
 * 
 * @param {*} passwordResetToken The password reset token that should be associated with a user.
 * @returns {Promise<true | UnauthorizedError>} A promise that resolves to `true` if the token is valid, or an UnauthorizedError.
 */
export const validatePasswordResetToken = async (passwordResetToken) => {
  const authenticatedUser = await userRepository.findBy(
    "passwordResetToken",
    passwordResetToken
  );
  if (!authenticatedUser) {
    return new UnauthorizedError(
      "The password reset token is invalid. Please request a new token."
    );
  }

  const tokenExpiration = new Date(
    authenticatedUser.passwordResetTokenExpiration
  );
  if (Date.now() >= tokenExpiration) {
    return new UnauthorizedError(
      "The password reset token has expired. Please request a new token."
    );
  }

  return true;
};