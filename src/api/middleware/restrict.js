import UnauthorizedError from "../errors/UnauthorizedError.js";
import { verifyJWT } from "../features/auth/authentication.service.js";

/**
 * Restricts an API endpoint to requests containing the API key in a cookie or query parameter.
 */
export const restrict = (req, res, next) => {
  const apiKeyCookie = req.cookies.apiKey;
  const tokenPayload = verifyJWT(apiKeyCookie)?.data;
  const apiKey = tokenPayload || req.query.API_KEY;
  if (!apiKey || apiKey !== process.env.API_KEY) {
    return next(new UnauthorizedError("Invalid API key"));
  }
  // No auth issues, carry on.
  next();
}