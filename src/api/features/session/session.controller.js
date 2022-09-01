import logger from "../../config/winston.config.js";
import { setApiKeyCookie } from "../../shared/helpers.js";
import { getSessionData } from "./session.service.js";

/**
 * Extracts session data from cookies sent in the request and clears expired/invalid cookies.
 * 
 * Endpoint: GET /session
 */
export const handleGetSessionData = (req, res, next) => {
  const { apiKey } = req.cookies;

  // Provide an API key to the user as an HttpOnly cookie.
  if (!apiKey) {
    setApiKeyCookie(res);
  }

  const sessionData = getSessionData(req.cookies);
  if (sessionData instanceof Error) {
    return next(sessionData);
  }

  if (!sessionData.game) {
    res.clearCookie("game");
  }
  if (!sessionData.user) {
    res.clearCookie("token");
  }

  logger.debug("Session Data", {
    sessionData: sessionData,
  });

  return res.json(sessionData ? sessionData : {});
};
