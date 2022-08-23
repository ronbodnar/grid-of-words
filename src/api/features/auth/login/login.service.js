import { InternalError } from "../../../errors/InternalError.js";
import { UnauthorizedError } from "../../../errors/UnauthorizedError.js";
import { ValidationError } from "../../../errors/ValidationError.js";
import { generateJWT } from "../authentication.service.js";
import { authService } from "../index.js";

/**
 * Attempts to log in by authenticating the email/password combination and generates a JWT if successful.
 * @param {string} email The email for the login request. 
 * @param {string} password The password for the login request.
 * @returns {Promise<object | ValidationError | UnauthorizedError | InternalError>} A promise that resolves to an object containing a success status and message, the authenticated user, and the generated JWT, or an Error.
 */
const login = async (email, password) => {
  if (!email || !password) {
    throw new ValidationError("Email and password are required.");
  }

  const authenticatedUser = await authService.authenticate(email, password);
  if (!authenticatedUser) {
    return new UnauthorizedError("Invalid email or password.");
  }

  const jwt = generateJWT(authenticatedUser);
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

export default {
  login,
};
