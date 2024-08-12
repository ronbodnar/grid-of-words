import crypto from "node:crypto";
import jwt from "jsonwebtoken";
import logger from "../config/winston.config.js";
import { User } from "../models/User.class.js";
import { findBy } from "../repository/user.repository.js";

export const authenticate = async (email, password) => {
  const dbUser = await findBy('email', email);
  if (!dbUser) {
    return false;
  }

  const salt = dbUser.getSalt();
  const userHash = dbUser.getHash();

  // Hash the password with the user's salt (first 16 bytes/32 hex chars are the salt)
  const hashedPassword = hashPassword(password, salt);

  logger.debug("Authentication Request received", {
    dbUserHashValue: dbUser.hash,
    salt: salt,
    userHash: userHash,
    hashedPass: hashedPassword,
  });

  // We 
  if (hashedPassword === userHash) {
    return dbUser;
  } else {
    return null;
  }
};

export const setTokenCookie = (res, payload) => {
  // Make sure we received a payload.
  if (!payload) {
    console.error("No payload provided to setTokenCookie");
    return null;
  }

  // Generate the JWT from the payload.
  const jwt = generateToken(payload);
  if (!jwt) {
    console.error("No JWT provided to setTokenCookie");
    return null;
  }

  // Delete the user's hash (password) from the cookie payload
  if (payload.user?.hash) {
    delete payload.user?.hash;
  }

  // Set the HttpOnly cookie "token" to the JWT token and set the age to 15 days.
  res.cookie("token", jwt, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    maxAge: 1000 * 60 * 60 * 24 * 15, // 15 days
    sameSite: "strict",
  });
  return jwt;
};

export const setApiKeyCookie = (res) => {
  // Generate a 30-day JWT for the API key.
  const apiKey = generateToken(process.env.API_KEY, "30d");

  // Add the API key to the apiKey cookie.
  res.cookie("apiKey", apiKey, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    maxAge: 1000 * 60 * 60 * 24 * 60, // 15 days
    sameSite: "strict",
  });
};

/**
 * Generates a random salt string.
 *
 * @returns {string} A randomly generated salt as a hexadecimal string.
 */
export const generateSalt = (bytes) => {
  bytes = bytes || 16;
  const salt = crypto.randomBytes(bytes).toString("hex");
  return salt;
};

/**
 * Generates a hash string from the given password and salt using the specified hash algorithm.
 *
 * @param {string} password - The password to hash.
 * @param {string} salt - The secret ingredient used in the hash.
 * @param {string} algorithm - The hash algorithm to use (default is "sha256").
 * @returns {string} The hashed password as a hexadecimal string.
 */
export const hashPassword = (password, salt, algorithm = "sha256") => {
  const hash = crypto
    .createHmac(algorithm, salt)
    .update(password)
    .digest("hex");
  return hash;
};

/**
 * Generates a JSON Web Token for the given user.
 *
 * @param {Object} payload - The user object containing user details.
 * @param {string} expiresIn - The expiration time of the token. (default: '15d')
 * @returns {string} The generated token.
 */
export const generateToken = (payload, expiresIn = "15d") => {
  if (!payload) {
    logger.error("No payload provided to generateToken", {
      payload: payload
    })
    return;
  }
  // Remove the hash property from the user object so it doesn't get included in the payload.
  if (payload.data?.hash) {
    delete payload.data.hash;
  }

  // Sign the payload with the JWT_SECRET and set the expiration time to 15 days.
  const token = jwt.sign(
    {
      data: payload,
    },
    process.env.JWT_SECRET,
    { expiresIn: expiresIn }
  );
  return token;
};

/**
 * Verifies a JSON Web Token and decodes it.
 *
 * @param {string} token - The JWT to verify.
 * @returns {Object|undefined} The decoded token if verification is successful, otherwise undefined.
 */
export const verifyToken = (token) => {
  if (!token) {
    console.log("no token");
    return null;
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    return decoded;
  } catch (error) {
    return null;
  }
};

/**
 * Extracts the token from the request and verifies the token to obtain the
 * user details or undefined if the token is not valid.
 *
 * @param {Request} req The request object to extract the token from.
 * @returns The user from the payload if present, otherwise undefined.
 */
export const getAuthenticatedUser = (req) => {
  // Check if the token is present in the cookies.
  if (!req?.cookies?.token) {
    return null;
  }

  // Decode token to get the payload.
  const decodedPayload = verifyToken(req.cookies.token);
  
  // Validate the presence of a user object within the token's payload.
  if (!decodedPayload?.data) {
    return null;
  }

  const user = new User().fromJSON(decodedPayload.data);

  // Return the user object from the decoded payload.
  return user;
};
