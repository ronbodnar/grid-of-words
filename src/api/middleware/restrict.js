import { UnauthorizedError } from "../errors/UnauthorizedError.js";
import { authService } from "../features/auth/index.js";

/**
 * Restricts an API endpoint to requests containing the API key in a cookie or query parameter.
 */
export const restrict = (req, res, next) => {
  // Try to get the API key from cookies first.
  let apiKey = authService.verifyToken(req.cookies?.apiKey)?.data;

  // Try to find the API key in the query parameters.
  if (!apiKey) {
    apiKey = req.query.API_KEY;
  }

  // No key was found or the key provided doesn't match.
  if (!apiKey || apiKey !== process.env.API_KEY) {
    return next(new UnauthorizedError("Invalid API key"));
  }

  // No auth issues, carry on.
  next();
}