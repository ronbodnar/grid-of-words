import logger from "../config/winston.config.js";
import crypto from "node:crypto";
import jwt from "jsonwebtoken";
import { getByEmail } from "./user.service.js";

export const authenticate = async (email, pass) => {
  const dbUser = await getByEmail(email);
  if (dbUser === undefined) {
    return false;
  }

  console.log(pass, dbUser);

  // Hash the password with the user's salt
  const hashedPass = hashPassword(pass, dbUser.salt);

  console.log(hashedPass, dbUser.hash.substring(16));

  // Compare the hashed password with the stored password (remove the salt from the hash)
  if (hashedPass === dbUser.hash.substring(16)) {
    return dbUser;
  } else {
    return undefined;
  }
};

export const generateSession = (req, res, authenticatedUser) => {
  return req.session.regenerate(function (err) {
    if (err) {
      logger.error("Error regenerating session", {
        error: err,
        request: req,
      });
      return res.json({
        message: "Authentication failed: session regeneration",
      });
    }

    req.session.user = authenticatedUser;
    req.session.isLoggedIn = true;
    logger.info("Successful user login attempt", {
      user: authenticatedUser,
      request: req,
    });
    return res.json({
      message: "User logged in successfully",
      user: authenticatedUser,
    });
  });
};

export const generateSalt = () => {
  const salt = crypto.randomBytes(16).toString("hex");
  return salt;
};

export const hashPassword = (password, salt) => {
  const hash = crypto.createHmac("sha256", salt).update(password).digest("hex");
  return hash;
};

export const generateToken = (user) => {
  const token = jwt.sign(
    {
      id: user.id,
      username: user.username,
    },
    process.env.JWT_SECRET,
    { expiresIn: "1h" }
  );
  return token;
};

export const verifyToken = (token) => {
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    return decoded;
  } catch (error) {
    return null;
  }
};
