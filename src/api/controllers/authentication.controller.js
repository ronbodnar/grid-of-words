import logger from "../config/winston.config.js";
import { User } from "../models/User.class.js";
import { findByEmail, save } from "../repository/user.repository.js";
import {
  authenticate,
  generateSession,
  generateToken,
  verifyToken,
} from "../services/authentication.service.js";

export const loginUser = async (req, res) => {
  // What about when a user is already logged in?

  const email = req.body.email;
  const password = req.body.password;

  console.log("Cookies", req.cookies);

  if (!email || !password) {
    return res.status(400).json({
      status: "error",
      error: "Email and password are required",
    });
  }

  const authenticatedUser = await authenticate(email, password);

  if (!authenticatedUser) {
    return res.status(401).json({
      error: "Invalid email or password",
    });
  }

  // Generate a JWT and set the HttpOnly cookie.
  const jwt = generateToken(authenticatedUser);
  res.cookie("token", jwt, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    maxAge: 60 * 60 * 24 * 30, // 30 days
    sameSite: "strict",
  });

  return res.json({
    message: "Login successful",
  })

  //return generateSession(req, res, authenticatedUser);
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
      error:
        "Username must be 3-16 characters long.\r\nA-z, numbers, hyphen, underscore, spaces only.",
    });
  }

  // Ensure the e-mail format is valid.
  if (!emailRegex.test(email)) {
    return res.status(400).json({
      status: "error",
      error: "Email is not a valid email address.",
    });
  }

  // Try to find an existing user with the same email.
  const dbUser = await findByEmail(email);
  if (dbUser) {
    return res.status(409).json({
      error: "Email already in use",
    });
  }

  const user = new User(email, username, password);

  // Try to save the user in the database.
  if (await save(user)) {
    // Generate a JWT and set the HttpOnly cookie.
    const jwt = generateToken(user);
    res.cookie("token", jwt, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24 * 30, // 30 days
      sameSite: "strict",
    });
    return res.json({
      message: "Registration successful"
    })
  } else {
    return res.status(500).json({
      error: "Failed to save user",
    });
  }
};

export const whoisUser = (req, res) => {
  if (req.session.user) {
    res.json({
      user: req.session.user,
    });
  } else {
    res.status(401).end();
  }
};

export const logoutUser = (req, res) => {};
