import logger from "../../../config/winston.config.js";
import { InternalError, UnauthorizedError, ValidationError } from "../../../errors/index.js";
import { userRepository } from "../../user/index.js";
import { authService } from "../index.js";

/**
 * Attempts to log in by authenticating the email/password combination and generates a JWT if successful.
 * @param {string} email The email for the login request. 
 * @param {string} password The password for the login request.
 * @returns {Promise<object | ValidationError | UnauthorizedError | InternalError>} A promise that resolves to an object containing a success status and message, the authenticated user, and the generated JWT, or an Error.
 */
export const login = async (email, password) => {
  if (!email || !password) {
    throw new ValidationError("Email and password are required.");
  }

  const authenticatedUser = await authenticate(email, password);
  if (!authenticatedUser) {
    return new UnauthorizedError("Invalid email or password.");
  }

  const jwt = authService.generateJWT(authenticatedUser);
  if (!jwt) {
    return new InternalError("Failed to generate JWT");
  }

  return {
    status: "success",
    message: "Login successful.",
    user: authenticatedUser,
    token: jwt,
  };
};

const authenticate = async (email, password) => {
  const dbUser = await userRepository.findBy("email", email);
  if (!dbUser) {
    return false;
  }

  const salt = dbUser.getSalt();
  const userHash = dbUser.getHash();

  // Hash the password with the user's salt (first 16 bytes/32 hex chars are the salt)
  const hashedPassword = authService.hashPassword(password, salt);

  // Remove sensitive information from the returned user object.
  delete dbUser.hash;
  delete dbUser.passwordResetToken;
  delete dbUser.passwordResetTokenExpiration;

  if (hashedPassword === userHash) {
    return dbUser;
  } else {
    return null;
  }
};