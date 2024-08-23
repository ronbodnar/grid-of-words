import logger from "../../../config/winston.config.js";
import { EMAIL_REGEX } from "../../../shared/constants.js";
import ValidationError from "../../../errors/ValidationError.js";
import { findUserBy } from "../../user/user.repository.js";
import { generateSalt } from "../authentication.service.js";
import { sendPasswordResetEmail } from "../../email/email.service.js";

/**
 * Processes the request to send a password reset link via email. Most errors default to a success to hide output to users.
 * 
 * @param {string} email The email address that potentially belongs to a user account.
 * @returns {Promise<object | ValidationError>} A promise that resolves to an object with a success message or a ValidationError.
 */
export const forgotPassword = async (email) => {
  const successResponse = {
    statusCode: 200,
    message:
      "If the email matches an account, a password reset link will be sent with next steps.",
  };

  if (!EMAIL_REGEX.test(email)) {
    return new ValidationError(
      "The email address is not a valid email format."
    );
  }

  const dbUser = await findUserBy("email", email);
  if (!dbUser) {
    return successResponse;
  }

  const token = generateSalt(32);

  dbUser.passwordResetToken = token;
  dbUser.passwordResetTokenExpiration = new Date(Date.now() + 1000 * 60 * 60);

  const saveUserResult = await dbUser.save();
  if (!saveUserResult) {
    logger.error("Failed to save user with reset token", {
      email: email,
      token: token,
      dbUser: dbUser,
    });
    return successResponse;
  }

  const sendEmailResponse = await sendPasswordResetEmail(dbUser, token);
  if (!sendEmailResponse) {
    logger.error("Failed to send password reset email", {
      email: email,
      token: token,
      dbUser: dbUser,
    });
    return successResponse;
  }

  return successResponse;
};