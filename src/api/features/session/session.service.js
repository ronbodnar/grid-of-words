import { UnauthorizedError } from "../../errors/index.js";
import { authService } from "../auth/index.js";

/**
 * Retrieves data such as user and game details from the request cookies and builds an object of the data.
 * 
 * @param {any} cookies The data from the request cookies property.
 * @returns {object} An object representing the session data.
 */
export const getSessionData = (cookies = {}) => {
  const sessionData = {};

  const { game, token } = cookies;

  if (token) {
    const payload = authService.verifyJWT(token);
    if (!payload) {
      return new UnauthorizedError("Invalid token");
    }
    sessionData.user = payload.data;
  }

  if (game && game._id) {
    sessionData.game = game;
  }
  return sessionData;
};
