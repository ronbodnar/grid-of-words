import InternalError from "../../../errors/InternalError.js";
import ValidationError from "../../../errors/ValidationError.js";
import { abandonGameById } from "./abandon.service.js";

/**
 * Abandons the specified game and clears the game session.
 *
 * Endpoint: POST /game/:id/abandon
 * 
 * @async
 */
export const handleAbandonGameById = async (req, res, next) => {
  const gameId = req.params.id;
  const authToken = req.cookies.token;
  if (!gameId) {
    return next(new ValidationError("Missing id parameter"));
  }

  const abandonResult = abandonGameById(gameId, authToken);
  if (!abandonResult) {
    const error = new InternalError("Failed to retrieve abandon response", {
      gameId: gameId,
      abandonResponse: abandonResult,
    });
    return next(error);
  }

  res.clearCookie("game");

  return res.json(abandonResult);
};
