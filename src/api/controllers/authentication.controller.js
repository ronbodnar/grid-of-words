import { authenticate, generateSession } from "../services/authentication.service.js";

export const loginUser = async (req, res) => {
  // What about when a user is already logged in?

  const username = req.body.username;
  const password = req.body.password;

  if (!username || !password) {
    return res.status(400).json({
      status: "error",
      error: "Username and password are required",
    });
  }

  const authenticatedUser = await authenticate(username, password);

  if (!authenticatedUser) {
    return res.status(401).json({
      error: "Invalid username or password",
    });
  }

  return generateSession(req, res, authenticatedUser);
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

export const registerUser = (req, res) => {};
