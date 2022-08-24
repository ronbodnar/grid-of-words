import { authService } from "../index.js";
import { UnauthorizedError, ValidationError } from "../../../errors/index.js";
import { userRepository } from "../../user/index.js";

// TODO: verify password isn't the same as the current password? additional complexity?
export const resetPassword = async (newPassword, passwordResetToken) => {
  if (newPassword.length < 8) {
    return new ValidationError(
      "New password must be at least 8 characters long."
    );
  }

  const authenticatedUser = await userRepository.findBy(
    "passwordResetToken",
    passwordResetToken
  );
  if (!authenticatedUser) {
    return new UnauthorizedError("The password reset token is invalid.");
  }

  // Generate a new salt and hash the new password + preprend the hash with the salt.
  const newSalt = authService.generateSalt();
  const newPasswordHash =
    newSalt + authService.hashPassword(newPassword, newSalt);

  authenticatedUser.hash = newPasswordHash;
  authenticatedUser.passwordResetToken = null;
  authenticatedUser.passwordResetTokenExpiration = null;
  authenticatedUser.save();

  return {
    status: "success",
    message: "Password reset successfully.",
  };
};
