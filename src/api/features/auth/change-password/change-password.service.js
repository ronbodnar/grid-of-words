import UnauthorizedError from "../../../errors/UnauthorizedError.js";
import ValidationError from "../../../errors/ValidationError.js";
import { findUserBy } from "../../user/user.repository.js";
import { generateSalt, getAuthenticatedUser, hashPassword } from "../authentication.service.js";

export const changePassword = async (newPassword, currentPassword, authToken) => {
  if (newPassword === currentPassword) {
    return new ValidationError(
      "New password cannot be the same as the current password."
    );
  }

  if (newPassword.length < 8) {
    return new ValidationError(
      "New password must be at least 8 characters long."
    );
  }

  const claimUser = getAuthenticatedUser(authToken);
  if (!claimUser) {
    return new UnauthorizedError("User is not authenticated.");
  }

  // Look up the user in the database to get current information.
  const authenticatedUser = await findUserBy("_id", claimUser._id);
  if (!authenticatedUser) {
    // Should it should show the login view?
    return new UnauthorizedError(
      "Please log out and back in to change your password."
    );
  }

  // Grab the salt and hashed passsword of the user.
  const salt = authenticatedUser.getSalt();
  const actualPasswordHash = authenticatedUser.getHash();

  // Hash the provided current password with the user's salt (first 16 bytes/32 hex chars of user hash are the salt)
  const providedPasswordHash = hashPassword(currentPassword, salt);

  // Passwords aren't a match, so we respond with a 401 Unauthorized error.
  if (actualPasswordHash !== providedPasswordHash) {
    return new UnauthorizedError(
      "The current password you provided is not correct."
    );
  }

  // Hash the new password with a new salt and then prepend with hash with the salt.
  const newSalt = generateSalt();
  const newPasswordHash =
    newSalt + hashPassword(newPassword, newSalt);

  // Update the user's hashed password and save it in the database.
  authenticatedUser.save({
    hash: newPasswordHash
  });

  return {
    status: "success",
    message: "Password changed successfully.",
  };
};