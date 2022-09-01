import ValidationError from "../../errors/ValidationError.js";
import {
  getGameById,
} from "./game.service.js";

/**
 * Handles retrieval of a {@link Game} object with the specified `gameId`.
 *
 * Endpoint: GET /game/:id
 * 
 * @async
 */
export const handleGetGameById = async (req, res, next) => {
  const gameId = req.params.id;
  if (!gameId) {
    return next(new ValidationError("Missing id parameter"));
  }
  return res.json(getGameById(gameId));
};