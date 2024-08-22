import { setApiKeyCookie } from "../../shared/helpers.js";
import sessionService from "./session.service.js";

/**
 * Extract session data from cookies sent in the request.
 */
export const getSessionData = (req, res, next) => {
  const { apiKey } = req.cookies;

  // Provide an API key to the user as an HttpOnly cookie.
  if (!apiKey) {
    setApiKeyCookie(res);
  }

  const sessionData = sessionService.getSessionData(req.cookies);
  if (sessionData instanceof Error) {
    return next(sessionData);
  }
  res.json(sessionData ? sessionData : {});
};
