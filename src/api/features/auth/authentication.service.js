import crypto from "node:crypto";
import jwt from "jsonwebtoken";
import { User } from "../user/index.js";
import { ValidationError } from "../../errors/index.js";

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
 * @param {string | number} expiresIn - The expiration time of the token. (default: '15d')
 * @returns {string | null} The generated token.
 */
export const generateJWT = (payload, expiresIn = "15d") => {
  if (!payload) {
    return new ValidationError("No payload provided to generateJWT", { payload: payload });
  }

  const { data } = payload;

  if (data?.hash) {
    delete data.hash;
  }

  const token = jwt.sign(
    {
      data: payload, // sign the whole payload, not just the payload data
    },
    process.env.JWT_SECRET,
    { expiresIn: expiresIn }
  );
  return token;
};

/**
 * Verifies the JSON Web Token using the secret key to decode the payload.
 *
 * @param {string} token - The JWT to verify.
 * @returns {Object|undefined} The decoded token if verification is successful, otherwise undefined.
 */
export const verifyJWT = (token) => {
  if (!token) {
    return null;
  }
  try {
    return jwt.verify(token, process.env.JWT_SECRET);
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
export const getAuthenticatedUser = (token) => {
  if (!token) {
    return null;
  }
  const decodedPayload = verifyJWT(token);
  if (!decodedPayload?.data) {
    return null;
  }
  const user = new User().fromJSON(decodedPayload.data);
  return user;
};