import logger from "../config/winston.config.js";
import { User } from "../models/User.class.js";
import { findByEmail, save } from "../repository/user.repository.js";
import {
  setTokenCookie,
  authenticate,
  verifyToken,
  setApiKeyCookie,
} from "../services/authentication.service.js";

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

  const usernameRegex = /^[a-zA-Z0-9 _-]{3,16}$/;
  const emailRegex = /^[a-zA-Z0-9._+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

  logger.info("Received request to register user", {
    email: email,
    password: password,
    username: username,
  });

  // Ensure the username format is valid.
  if (!usernameRegex.test(username)) {
    return res.status(400).json({
      status: "error",
      message:
        "Username must be 3-16 characters long.\r\nA-z, numbers, hyphen, underscore, spaces only.",
    });
  }

  // Ensure the e-mail format is valid.
  if (!emailRegex.test(email)) {
    return res.status(400).json({
      status: "error",
      message: "Email is not a valid email address.",
    });
  }

  // Try to find an existing user with the same email.
  const dbUser = await findByEmail(email);
  if (dbUser) {
    // This is a potential security risk in the future (exposing who uses the app)
    return res.status(409).json({
      status: "error",
      message: "Email already in use",
    });
  }

  const user = new User(email, username, password);

  // Try to save the user in the database.
  if (await save(user)) {
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

  // If a JWT is present in the request, we need to verify it to provide the authenticated user.
  if (req.cookies?.token) {
    const payload = verifyToken(req.cookies.token);

    if (payload?.data) {
      sessionData.user = payload.data;
    }
  }

  // Respond with the session data in JSON format.
  res.json(sessionData);
};
