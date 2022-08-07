import logger from "../config/winston.config.js";
import crypto from "node:crypto";
import jwt from "jsonwebtoken";
import { getByEmail } from "./user.service.js";

export const authenticate = async (email, pass) => {
  const dbUser = await getByEmail(email);
  if (dbUser === undefined) {
    return false;
  }

  // Hash the password with the user's salt
  const hashedPass = hashPassword(pass, dbUser.salt);

  // Compare the hashed password with the stored password (remove the salt from the start of the hash)
  if (hashedPass === dbUser.hash.substring(dbUser.salt.length)) {
    return dbUser;
  } else {
    return undefined;
  }
};

export const addJWTCookie = (res, payload) => {
  // Generate a JWT and set the HttpOnly cookie.
  const jwt = generateToken(payload);
  if (!jwt) return undefined;

  // Set the HttpOnly cookie "token" to the JWT token and set the age to 15 days.
  res.cookie("token", jwt, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    maxAge: 60 * 60 * 24 * 15, // 15 days
    sameSite: "strict",
  });
  return jwt;
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
    { expiresIn: "15d" }
  );
  return token;
};

export const verifyToken = (token) => {
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    logger.info("Decoded token:", {
      token: decoded
    });
    return decoded;
  } catch (error) {
    return null;
  }
};
