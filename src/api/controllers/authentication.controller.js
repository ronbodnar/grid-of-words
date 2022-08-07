import logger from "../config/winston.config.js";
import { User } from "../models/User.class.js";
import { findByEmail, save } from "../repository/user.repository.js";
import {
  addJWTCookie,
  authenticate,
} from "../services/authentication.service.js";

export const loginUser = async (req, res) => {
  // What about when a user is already logged in?

  const email = req.body.email;
  const password = req.body.password;

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
  if (!addJWTCookie(res, authenticatedUser)) {
    return res.json({
      status: "error",
      message: "Error adding JWT to cookies.",
    });
  }


  // Hide the hash and salt from output (temporarily)
  //TODO: this is not a great solution
  delete authenticatedUser.hash;
  delete authenticatedUser.salt;

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
    addJWTCookie(res, user);
    return res.json({
      status: "success",
      message: "Registration successful"
    })
  } else {
    return res.status(500).json({
      status: "error",
      message: "Failed to save user",
    });
  }
};

export const whoisUser = (req, res) => {
  if (req.cookies.token) {
    res.json({
      user: '',
    });
  } else {
    res.status(401).end();
  }
};

export const logoutUser = (req, res) => {};
