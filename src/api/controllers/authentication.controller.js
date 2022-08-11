import { EMAIL_REGEX, USERNAME_REGEX } from "../constants.js";
import logger from "../config/winston.config.js";
import { User } from "../models/User.class.js";
import {
  findByEmail,
  findById,
  insertUser,
  saveUser,
} from "../repository/user.repository.js";
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

  // Try to find an existing user with the same email.
  const dbUser = await findByEmail(email);
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
  const authenticatedUser = await findById(claimUser.id);
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
  saveUser(authenticatedUser);

  // Clear the user's auth token from cookies
  res.clearCookie("token");

  res.json({
    status: "success",
    message: "Password changed successfully.",
  });
};

export const forgotPassword = async (req, res) => {
  const email = req.body.email;

  if (!EMAIL_REGEX.test(email)) {
    return res.status(400).json({
      status: "error",
      message: "Invalid email address format.",
    });
  }

  const dbUser = await findByEmail(email);

  if (!dbUser) {
    return res.end();
  }

  const token = generateSalt(32);

  const data = await sendResetPasswordEmail(dbUser, token);
  console.log(data);

  res.json({
    message: email
  });
}

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
