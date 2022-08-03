import logger from "../config/winston.config.js";
import { authenticate } from "../services/authentication.service.js";

export const loginUser = (req, res) => {
  // What about when a user is already logged in?

  const username = req.body.username;
  const password = req.body.password;

  if (!username || !password) {
    return res.status(400).json({
      status: "error",
      error: "Username and password are required.",
    });
  }

  return authenticate(username, password);
};

export const whoisUser = (req, res) => {
  if (req.session.user) {
    res.json({
      user: req.session.user,
    });
  } else {
    res.status(401).json({
      error: "User not logged in.",
    });
  }
};

export const logoutUser = (req, res) => {};

export const registerUser = (req, res) => {};
