import UnauthorizedError from "../../errors/UnauthorizedError.js";
import { verifyJWT } from "../auth/authentication.service.js";
import GameState from "../game/GameState.js";

/**
 * Retrieves data such as user and game details from the request cookies and builds an object of the data.
 *
 * @param {any} cookies The data from the request cookies property.
 * @returns {object} An object representing the session data.
 */
export const getSessionData = (cookies = {}) => {
  const sessionData = {};

  const { game, token } = cookies;

  if (game) {
    const validState = game.state === GameState.IN_PROGRESS;
    const validAttempts = (game.attempts?.length || 10) <= game.maxAttempts;
    if (game._id && validAttempts && validState) {
      sessionData.game = game;
    }
  }

  if (token) {
    const payload = verifyJWT(token);
    if (!payload) {
      return new UnauthorizedError("Invalid token");
    }
    sessionData.user = payload.data;
  }
  return sessionData;
};
