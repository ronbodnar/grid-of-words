import { EMAIL_REGEX, USERNAME_REGEX } from "../constants.js";
import logger from "../config/winston.config.js";
import { User } from "../models/User.class.js";
import { findBy, insertUser } from "../repository/user.repository.js";
import {
  setTokenCookie,
  authenticate,
  verifyToken,
  setApiKeyCookie,
  getAuthenticatedUser,
  hashPassword,
  generateSalt,
} from "../services/authentication.service.js";
import { sendResetPasswordEmail } from "../services/reset-password.service.js";

/**
 * Performs authentication for the email and password combination provided in the request.
 *
 * Endpoint: /auth/login
 */
export const loginUser = async (req, res) => {
  // TODO: What about when a user is already logged in?

  // Extract email and password from the request body.
  const email = req.body.email;
  const password = req.body.password;

  // Validate that the email and password are provided in the request.
  if (!email || !password) {
    return res.status(400).json({
      status: "error",
      message: "Email and password are required.",
    });
  }

  // Attempt to authenticate the user with the provided email and password.
  // Respond with a 401 Unauthorized status if the authentication fails.
  const authenticatedUser = await authenticate(email, password);
  if (!authenticatedUser) {
    return res.status(401).json({
      status: "error",
      message: "Invalid email or password.",
    });
  }

  // Generate a JWT and set it in the cookie response.
  // Respond with a 500 Internal Server Error if the token generation fails.
  const generatedToken = setTokenCookie(res, authenticatedUser);
  if (!generatedToken) {
    return res.status(500).json({
      status: "error",
      message: "Error adding JWT to cookies.",
    });
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

export const registerUser = async (req, res) => {
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
    return res.status(400).json({
      status: "error",
      message:
        "Username must be 3-16 characters long.\r\nA-z, numbers, hyphen, underscore, spaces only.",
    });
  }

  // Ensure the e-mail format is valid.
  if (!EMAIL_REGEX.test(email)) {
    return res.status(400).json({
      status: "error",
      message: "Email is not a valid email address.",
    });
  }

  // Ensure the password is at least 8 characters long.
  if (password.length < 8) {
    return res.status(400).json({
      status: "error",
      message: "Password must be at least 8 characters long.",
    });
  }

  // Try to find an existing user with the same email.
  const dbUser = await findBy("email", email);
  if (dbUser) {
    // This is a potential security risk for bigger apps (exposing who uses the app)
    return res.status(409).json({
      status: "error",
      message: "Email already in use.",
    });
  }

  const user = new User(email, username, password);

  // Try to save the user in the database.
  if (await insertUser(user)) {
    return res.json({
      status: "success",
      message: "Registration successful.",
    });
  } else {
    return res.status(500).json({
      status: "error",
      message: "Failed to save user.",
    });
  }
};

export const logoutUser = (req, res) => {
  res.clearCookie("token");
  res.json({ status: "success", message: "Goodbye" });
};

export const changePassword = async (req, res) => {
  // Extract the provided current password and new passwords from the request body.
  const currentPassword = req.body.currentPassword;
  const newPassword = req.body.newPassword;

  // Validate that the required parameters are provided.
  if (!newPassword || !currentPassword) {
    return res.status(400).json({
      status: "error",
      message: "Current and new passwords are required.",
    });
  }

  // Validate that the new password does not match the current password.
  if (newPassword === currentPassword) {
    return res.status(400).json({
      status: "error",
      message: "New password cannot be the same as the current password.",
    });
  }

  // Validate that the new password meets the complexity requirements.
  if (newPassword.length < 8) {
    return res.status(400).json({
      status: "error",
      message: "New password must be at least 8 characters long.",
    });
  }

  // Grab the user that the token is claiming to be authenticate.
  // Respond with a 401 Unauthorized error if no auth user was found.
  const claimUser = getAuthenticatedUser(req);
  if (!claimUser) {
    return res.status(401).json({
      status: "error",
      message: "User is not authenticated.",
    });
  }

  // Look up the user in the database to get current information.
  const authenticatedUser = await findBy("id", claimUser.getUUID());
  if (!authenticatedUser) {
    return res.status(401).json({
      status: "error",
      message: "Please log out and back in to change your password.",
    });
  }

  // Grab the salt and hashed passsword of the user.
  const salt = authenticatedUser.getSalt();
  const actualPasswordHash = authenticatedUser.getHash();

  // Hash the provided current password with the user's salt (first 16 bytes/32 hex chars of user hash are the salt)
  const providedPasswordHash = hashPassword(currentPassword, salt);

  // Passwords aren't a match, so we respond with a 401 Unauthorized error.
  if (actualPasswordHash !== providedPasswordHash) {
    return res.status(401).json({
      status: "error",
      message: "Current password is not correct.",
    });
  }

  // Hash the new password with a new salt and then prepend with hash with the salt.
  const newSalt = generateSalt();
  const newPasswordHash = newSalt + hashPassword(newPassword, newSalt);

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

export const forgotPassword = async (req, res) => {
  const email = req.body.email || "";

  // Validate the email address and respond with a 400 Bad Request error if it's not valid.
  if (!EMAIL_REGEX.test(email)) {
    return res.status(400).json({
      status: "error",
      message: "Invalid email address format.",
    });
  }

  // Attempt to retrieve a user with the specified email.
  // If no user is found, end the request (obscuring the results).
  const dbUser = await findBy("email", email);
  if (!dbUser) {
    return res.end();
  }

  // Generate a random 32-byte hex string.
  const token = generateSalt(32);

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
    return res.end();
  }

  // Send a password reset email to the user containing a link to reset their password.
  // If the email sending fails, respond with a 500 Internal Server Error and log the error.
  const sendEmailResponse = await sendResetPasswordEmail(dbUser, token);
  if (!sendEmailResponse) {
    logger.error("Failed to send password reset email", {
      email: email,
      token: token,
      dbUser: dbUser,
    });
    return res.end();
  }

  // End the request (obscuring the results)
  res.end();
};

// TODO: verify password isn't the same as the current password.
export const resetPassword = async (req, res) => {
  // Extract the new password and passwordResetToken from the request body.
  const newPassword = req.body.newPassword;
  const passwordResetToken = req.body.passwordResetToken;

  // Verify we have all the required body parameters.
  if (!newPassword || !passwordResetToken) {
    console.log("missing params");
    return res.status(400).json({
      status: "error",
      message: "Missing required fields",
    });
  }

  // Password complexity requires 8 characters.
  if (newPassword.length < 8) {
    return res.status(400).json({
      status: "error",
      message: "New password must be at least 8 characters long.",
    });
  }

  // Look up the reset token in the database.
  const authenticatedUser = await findBy(
    "passwordResetToken",
    passwordResetToken
  );
  if (!authenticatedUser) {
    return res.status(401).json({
      status: "error",
      message: "The password reset token is invalid.",
    });
  }

  // Hash the new password with a new salt and then prepend with hash with the salt.
  const newSalt = generateSalt();
  const newPasswordHash = newSalt + hashPassword(newPassword, newSalt);

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

export const validatePasswordResetToken = async (req, res) => {
  // Extract the passwordResetToken from the request body.
  const passwordResetToken = req.body.passwordResetToken;

  if (!passwordResetToken) {
    return res.status(400).json({
      status: "error",
      message: "Missing password reset token.",
    });
  }

  // Look up the reset token in the database.
  const authenticatedUser = await findBy(
    "passwordResetToken",
    passwordResetToken
  );
  if (!authenticatedUser) {
    return res.status(401).json({
      status: "error",
      message:
        "The password reset token is invalid. Please request a new token.",
    });
  }

  // Verify the current time is greater than the expiration of the password reset token.
  // Throw a 401 Unauthorized if the token expiration is after the current time.
  const tokenExpiration = new Date(
    authenticatedUser.passwordResetTokenExpiration
  );
  if (Date.now() >= tokenExpiration) {
    return res.status(401).json({
      status: "error",
      message:
        "The password reset token has expired. Please request a new token.",
    });
  }

  return res.json({
    status: "success",
    message: "The password reset token is valid.",
  });
};

/**
 * Extract session data from cookies sent in the request.
 */
export const getSession = (req, res) => {
  // If no API Key is present in the request, provide it to the user as an HttpOnly cookie.
  if (!req.cookies?.apiKey) {
    setApiKeyCookie(res);
  }

  // The model to house session data like user and game information.
  let sessionData = {};

  // Verify the token cookie from the request if present.
  if (req.cookies?.token) {
    const payload = verifyToken(req.cookies.token);

    // The payload has data containing our user object.
    if (payload?.data) {
      sessionData.user = payload.data;
    }
  }

  // Add the game data from the game cookie if found in the request.
  if (req.cookies?.game) {
    sessionData.game = req.cookies.game;
  }

  // Respond with the session data in JSON format.
  res.json(sessionData);
};
