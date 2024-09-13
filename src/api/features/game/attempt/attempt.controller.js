import logger from "../../../config/winston.config.js"
import Game from "../Game.js"
import NotFoundError from "../../../errors/NotFoundError.js"
import ValidationError from "../../../errors/ValidationError.js"
import UnauthorizedError from "../../../errors/UnauthorizedError.js"
import { setCookie } from "../../../shared/helpers.js"
import { addAttempt } from "./attempt.service.js"

/**
 * Attempts to solve the word puzzle.
 *
 * Endpoint: POST /game/:id/attempt
 *
 * @async
 */
export const handleAddAttempt = async (req, res, next) => {
  const authToken = req.cookies.token
  const gameId = req.params.id
  const word = req.body.word

  if (!word || !gameId) {
    return next(new ValidationError("MISSING_WORD_OR_GAME_ID"))
  }

  const attemptResult = await addAttempt(word, gameId, authToken)
  if (attemptResult instanceof Error) {
    // Clear cookies when the user is attempting an invalid game.
    if (
      attemptResult instanceof NotFoundError ||
      attemptResult instanceof UnauthorizedError
    ) {
      res.clearCookie("game")
    }
    return next(attemptResult)
  }

  const { gameData, resultMessage } = attemptResult
  const isFinalAttempt = resultMessage === "WINNER" || resultMessage === "LOSER"

  // Update the cookies depending on the attempt result
  if (gameData && gameData instanceof Game) {
    if (isFinalAttempt) {
      res.clearCookie("game")
    } else {
      setCookie(res, {
        name: "game",
        value: gameData,
      })
    }
  } else {
    logger.warn("Unexpected attemptResult response", attemptResult)
  }

  return res.json(attemptResult)
}
