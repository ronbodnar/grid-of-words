import UnauthorizedError from "../../../errors/UnauthorizedError.js";
import ValidationError from "../../../errors/ValidationError.js";
import { findUserBy } from "../../user/user.repository.js";
import { generateSalt, hashPassword } from "../authentication.service.js";

// TODO: verify password isn't the same as the current password? additional complexity?
export const resetPassword = async (newPassword, passwordResetToken) => {
  if (newPassword.length < 8) {
    return new ValidationError(
      "New password must be at least 8 characters long."
    );
  }

  const authenticatedUser = await findUserBy(
    "passwordResetToken",
    passwordResetToken
  );
  if (!authenticatedUser) {
    return new UnauthorizedError("The password reset token is invalid.");
  }

  // Generate a new salt and hash the new password + preprend the hash with the salt.
  const newSalt = generateSalt();
  const newPasswordHash =
    newSalt + hashPassword(newPassword, newSalt);

  authenticatedUser.hash = newPasswordHash;
  authenticatedUser.passwordResetToken = null;
  authenticatedUser.passwordResetTokenExpiration = null;
  authenticatedUser.save();

  return {
    status: "success",
    message: "Password reset successfully.",
  };
};
