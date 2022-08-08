import logger from "../config/winston.config.js";
import { User } from "../models/User.class.js";
import { findByEmail, save } from "../repository/user.repository.js";
import {
  setTokenCookie,
  authenticate,
  verifyToken,
} from "../services/authentication.service.js";

export const loginUser = async (req, res) => {
  // What about when a user is already logged in?
  const email = req.body.email;
  const password = req.body.password;
  const showToken = req.body.showToken;

  if (!email || !password) {
    return res.status(400).json({
      status: "error",
      message: "Email and password are required.",
    });
  }

  const authenticatedUser = await authenticate(email, password);

  if (!authenticatedUser) {
    return res.status(401).json({
      status: "error",
      message: "Invalid email or password.",
    });
  }

  // Try to set the JWT in the user's cookies and error if it fails.
  const generatedToken = setTokenCookie(res, authenticatedUser);
  if (!generatedToken) {
    return res.status(500).json({
      status: "error",
      message: "Error adding JWT to cookies.",
    });
  }

  // Hide the hash from output by deleting the property from the authenticatedUser object.
  delete authenticatedUser.hash;

  return res.json({
    status: "success",
    message: "Login successful.",
    user: authenticatedUser,
    token: showToken ? generatedToken : undefined,
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
    setTokenCookie(res, user);
    return res.json({
      status: "success",
      message: "Registration successful",
    });
  } else {
    return res.status(500).json({
      status: "error",
      message: "Failed to save user",
    });
  }
};

export const logoutUser = (req, res) => {
  setTokenCookie(res, {});
  res.json({ status: "success", message: "Goodbye" });
};

// Serve any session data for the user in the initial GET request.
export const whoisUser = (req, res) => {
  // Just in case the cookies can't be found, end the response.
  if (!req?.cookies) {
    setTokenCookie(res, {});
    return res.status(400).end();
  }

  const payload = verifyToken(req.cookies.token);

  // The session data to be returned.
  res.json({
    user: !payload?.user ? undefined : payload.user,
    game: !payload?.game ? undefined : payload.game,
  });
};
