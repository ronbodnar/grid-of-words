import { EMAIL_REGEX, USERNAME_REGEX } from "../../shared/constants.js";
import logger from "../../config/winston.config.js";
import { userRepository } from "../user/index.js";
import { authService } from "./index.js";
import { User } from "../user/index.js";
import { sendPasswordResetEmail } from "../email/reset-password/index.js";
import { ValidationError } from "../../errors/ValidationError.js";
import { UnauthorizedError } from "../../errors/UnauthorizedError.js";
import { InternalError } from "../../errors/InternalError.js";
/**
 * Performs authentication for the email and password combination provided in the request.
 *
 * Endpoint: /auth/login
 */
export const loginUser = async (req, res, next) => {
  // TODO: What about when a user is already logged in?

  // Extract email and password from the request body.
  const email = req.body.email;
  const password = req.body.password;

  // Validate that the email and password are provided in the request.
  // Pass the error handler a ValidationError if the email or password are missing.
  if (!email || !password) {
    return next(new ValidationError("Email and password are required."));
  }

  // Attempt to authenticate the user with the provided email and password.
  // Pass the error handler an Unauthorized error if the authentication fails.
  const authenticatedUser = await authService.authenticate(email, password);
  if (!authenticatedUser) {
    return next(new UnauthorizedError("Invalid email or password."));
  }

  // Generate a JWT and set it in the cookie response.
  // Pass the error handler an InternalError if the token generation fails.
  const generatedToken = authService.setTokenCookie(res, authenticatedUser);
  if (!generatedToken) {
    return next(
      new InternalError("Adding token to cookies failed.", {
        email: email,
        authenticatedUser: authenticatedUser,
      })
    );
  }

  // Remove sensitive information from the token.
  delete authenticatedUser.hash;

  // Respond with a success message and the authenticated user details.
  return res.json({
    status: "success",
    message: "Login successful.",
    user: authenticatedUser,
  });
};

export const registerUser = async (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;
  const username = req.body.username;

  logger.info("Received request to register user", {
    email: email,
    password: password,
    username: username,
  });

  // Ensure the username format is valid.
  if (!USERNAME_REGEX.test(username)) {
    return next(
      new ValidationError(
        "Username must be 3-16 characters long.\r\nNo symbols other than - and _ allowed."
      )
    );
  }

  // Ensure the e-mail format is valid.
  if (!EMAIL_REGEX.test(email)) {
    return next(new ValidationError("Email address is not valid."));
  }

  // Ensure the password is at least 8 characters long.
  if (password.length < 8) {
    return next(
      new ValidationError("Password must be at least 8 characters long.")
    );
  }

  // Try to find an existing user with the same email.
  const dbUser = await userRepository.findBy("email", email);
  if (dbUser) {
    // This is a potential security risk for bigger apps (exposing who uses the app)
    return next(new ValidationError("Email address is already registered."));
  }

  const user = new User(email, username, password);

  // Try to save the user in the database.
  if (await userRepository.insertUser(user)) {
    return res.json({
      status: "success",
      message: "Registration successful.",
    });
  } else {
    return next(
      new InternalError("Failed to insert new user into the database.", {
        user: user,
      })
    );
  }
};

export const logoutUser = (req, res) => {
  res.clearCookie("token");
  res.json({ status: "success", message: "You have logged out successfully." });
};

export const changePassword = async (req, res, next) => {
  // Extract the provided current password and new passwords from the request body.
  const currentPassword = req.body.currentPassword;
  const newPassword = req.body.newPassword;

  // Validate that the required parameters are provided.
  if (!newPassword || !currentPassword) {
    return next(
      new ValidationError("Current and new passwords must be provided.")
    );
  }

  // Validate that the new password does not match the current password.
  if (newPassword === currentPassword) {
    return next(
      new ValidationError(
        "New password cannot be the same as the current password."
      )
    );
  }

  // Validate that the new password meets the complexity requirements.
  if (newPassword.length < 8) {
    return next(
      new ValidationError("New password must be at least 8 characters long.")
    );
  }

  // Grab the user that the token is claiming to be authenticate.
  // Respond with a 401 Unauthorized error if no auth user was found.
  const claimUser = authService.getAuthenticatedUser(req);
  if (!claimUser) {
    return next(new UnauthorizedError("User is not authenticated."));
  }

  // Look up the user in the database to get current information.
  const authenticatedUser = await userRepository.findBy(
    "_id",
    claimUser._id
  );
  if (!authenticatedUser) {
    // Should it should show the login view?
    return next(
      new UnauthorizedError(
        "Please log out and back in to change your password."
      )
    );
  }

  // Grab the salt and hashed passsword of the user.
  const salt = authenticatedUser.getSalt();
  const actualPasswordHash = authenticatedUser.getHash();

  // Hash the provided current password with the user's salt (first 16 bytes/32 hex chars of user hash are the salt)
  const providedPasswordHash = authService.hashPassword(currentPassword, salt);

  // Passwords aren't a match, so we respond with a 401 Unauthorized error.
  if (actualPasswordHash !== providedPasswordHash) {
    return next(
      new UnauthorizedError("The current password you provided is not correct.")
    );
  }

  // Hash the new password with a new salt and then prepend with hash with the salt.
  const newSalt = authService.generateSalt();
  const newPasswordHash =
    newSalt + authService.hashPassword(newPassword, newSalt);

  // Update the user's hashed password and save it in the database.
  authenticatedUser.hash = newPasswordHash;
  authenticatedUser.save("hash");

  // Clear the user's auth token from cookies
  res.clearCookie("token");

  res.json({
    status: "success",
    message: "Password changed successfully.",
  });
};

export const forgotPassword = async (req, res, next) => {
  const email = req.body.email || "";

  // Blanket response to the client
  const successResponse = res.json({
    statusCode: 200,
    message:
      "If the email matches an account, a password reset link will be sent with next steps.",
  });

  // Validate the email address and throw a ValidationError if it's not valid.
  if (!EMAIL_REGEX.test(email)) {
    return next(
      new ValidationError("The email address is not a valid email format.")
    );
  }

  // Attempt to retrieve a user with the specified email.
  // If no user is found, end the request (obscuring the results).
  const dbUser = await userRepository.findBy("email", email);
  if (!dbUser) {
    logger.debug("Trying to reset password for invalid email address", {
      email: email,
    })
    return successResponse;
  }

  // Generate a random 32-byte hex string.
  const token = authService.generateSalt(32);

  dbUser.passwordResetToken = token;
  dbUser.passwordResetTokenExpiration = new Date(Date.now() + 1000 * 60 * 60); // 1 hour expiration.

  // Save the user with the updated token and expiration date.
  // If the save fails, respond with a 500 Internal Server Error and log the error.
  const saveUserResult = await dbUser.save([
    "passwordResetToken",
    "passwordResetTokenExpiration",
  ]);
  if (!saveUserResult) {
    logger.error("Failed to save user with reset token", {
      email: email,
      token: token,
      dbUser: dbUser,
    });
    return successResponse;
  }

  // Send a password reset email to the user containing a link to reset their password.
  // If the email sending fails, respond with a 500 Internal Server Error and log the error.
  const sendEmailResponse = await sendPasswordResetEmail(dbUser, token);
  if (!sendEmailResponse) {
    logger.error("Failed to send password reset email", {
      email: email,
      token: token,
      dbUser: dbUser,
    });
    return successResponse;
  }

  // End the request (obscuring the results)
  return successResponse;
};

// TODO: verify password isn't the same as the current password.
export const resetPassword = async (req, res, next) => {
  // Extract the new password and passwordResetToken from the request body.
  const newPassword = req.body.newPassword;
  const passwordResetToken = req.body.passwordResetToken;

  // Verify we have all the required body parameters.
  if (!newPassword || !passwordResetToken) {
    logger.error("missing params");
    return next(new ValidationError("Missing required fields."));
  }

  // Password complexity requires 8 characters.
  if (newPassword.length < 8) {
    return next(
      new ValidationError("New password must be at least 8 characters long.")
    );
  }

  // Look up the reset token in the database.
  const authenticatedUser = await userRepository.findBy(
    "passwordResetToken",
    passwordResetToken
  );
  if (!authenticatedUser) {
    return next(new UnauthorizedError("The password reset token is invalid."));
  }

  // Hash the new password with a new salt and then prepend with hash with the salt.
  const newSalt = authService.generateSalt();
  const newPasswordHash =
    newSalt + authService.hashPassword(newPassword, newSalt);

  // Update the user's hashed password and invalidate the passwordResetToken, then save the user with those values.
  authenticatedUser.hash = newPasswordHash;
  authenticatedUser.passwordResetToken = null;
  authenticatedUser.passwordResetTokenExpiration = null;
  authenticatedUser.save([
    "hash",
    "passwordResetToken",
    "passwordResetTokenExpiration",
  ]);

  // Clear the user's auth token from cookies.
  res.clearCookie("token");

  res.json({
    status: "success",
    message: "Password reset successfully.",
  });
};

export const validatePasswordResetToken = async (req, res, next) => {
  const passwordResetToken = req.body.passwordResetToken;
  if (!passwordResetToken) {
    return next(new ValidationError("Missing password reset token."));
  }

  const authenticatedUser = await userRepository.findBy(
    "passwordResetToken",
    passwordResetToken
  );
  if (!authenticatedUser) {
    return next(
      new UnauthorizedError(
        "The password reset token is invalid. Please request a new token."
      )
    );
  }

  const tokenExpiration = new Date(
    authenticatedUser.passwordResetTokenExpiration
  );
  if (Date.now() >= tokenExpiration) {
    return next(
      new UnauthorizedError(
        "The password reset token has expired. Please request a new token."
      )
    );
  }

  return res.json({
    status: "success",
    message: "The password reset token is valid.",
  });
};

/**
 * Extract session data from cookies sent in the request.
 */
export const getSession = (req, res, next) => {
  // If no API Key is present in the request, provide it to the user as an HttpOnly cookie.
  if (!req.cookies?.apiKey) {
    authService.setApiKeyCookie(res);
  }

  let sessionData = {};

  if (req.cookies?.token) {
    const payload = authService.verifyToken(req.cookies.token);

    logger.info("Payload data from session token", {
      payload: payload
    });

    // The payload has data containing our user object.
    if (payload?.data) {
      sessionData.user = payload.data;
    }
  }

  if (req.cookies?.game) {
    sessionData.game = req.cookies.game;
  }

  res.json(Object.keys(sessionData).length > 0 ? sessionData : {});
};
