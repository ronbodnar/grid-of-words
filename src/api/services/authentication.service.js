import crypto from "node:crypto";
import jwt from "jsonwebtoken";
import { getByEmail } from "./user.service.js";
import logger from "../config/winston.config.js";

export const authenticate = async (email, pass) => {
  const dbUser = await getByEmail(email);
  if (dbUser === undefined) {
    return false;
  }

  const salt = dbUser.hash.substring(0, 32);
  const userHash = dbUser.hash.substring(32);

  // Hash the password with the user's salt (first 16 bytes/32 hex chars are the salt)
  const hashedPass = hashPassword(pass, salt);

  logger.debug("Authentication Request received", {
    dbUserHashValue: dbUser.hash,
    salt: salt,
    userHash: userHash,
    hashedPass: hashedPass
  });
  
  // Compare the hashed password with the stored password (remove the salt from the start of the hash)
  if (hashedPass === userHash) {
    return dbUser;
  } else {
    return undefined;
  }
};

export const setTokenCookie = (res, payload) => {
  // Generate a JWT and set the HttpOnly cookie.
  if (!payload) {
    console.error("No payload provided to setTokenCookie");
    return undefined;
  }
  const jwt = generateToken(payload);
  if (!jwt) {
    console.error("No JWT provided to setTokenCookie");
    return undefined;
  }

  if (payload == {}) {
    console.error("No user provided to setTokenCookie");
    return undefined;
  }

  // Delete the hash (password) from the cookie payload
  if (payload.hash)
    delete payload.hash;

  // Set the HttpOnly cookie "token" to the JWT token and set the age to 15 days.
  res.cookie("token", jwt, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    maxAge: 60 * 60 * 24 * 15, // 15 days
    sameSite: "strict",
  });
  return jwt;
};

/**
 * Generates a random salt string.
 * 
 * @returns {string} A randomly generated salt as a hexadecimal string.
 */
export const generateSalt = () => {
  const salt = crypto.randomBytes(16).toString("hex");
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
export const hashPassword = (password, salt, algorithm="sha256") => {
  const hash = crypto.createHmac(algorithm, salt).update(password).digest("hex");
  return hash;
};

/**
 * Generates a JSON Web Token for the given user.
 * 
 * @param {Object} user - The user object containing user details.
 * @returns {string} The generated token.
 */
export const generateToken = (user) => {
  delete user.hash;
  delete user.salt;
  const token = jwt.sign(
    {
      user: user,
    },
    process.env.JWT_SECRET,
    { expiresIn: "15d" }
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
    return undefined;
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    return decoded;
  } catch (error) {
    return undefined;
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
  // If the req, req.cookies, or req.cookies.token is not present.
  if (!req?.cookies?.token) return undefined;

  // Obtain the decoded payload information from the token.
  const decodedPayload = verifyToken(req.cookies.token);

  // If the payload isn't available or the user object is missing or doesn't contain and id property.
  if (!decodedPayload || !decodedPayload.user?.id) return undefined;

  // Return the user object.
  return decodedPayload.user;
}