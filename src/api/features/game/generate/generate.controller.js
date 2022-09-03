import {
  DEFAULT_LANGUAGE,
  DEFAULT_MAX_ATTEMPTS,
  DEFAULT_WORD_LENGTH,
} from "../../../shared/constants.js"
import { setCookie } from "../../../shared/helpers.js"
import NotFoundError from "../../../errors/NotFoundError.js"
import { getAuthenticatedUser } from "../../auth/authentication.service.js"
import { generateNewGame } from "./generate.service.js"

/**
 * Generates a new game with optional wordLength and maxAttempts params and adds the game to the user's cookies if successful.
 *
 * Endpoint: GET /game/new
 *
 * @async
 */
export const handleGenerateNewGame = async (req, res, next) => {
  const wordLength = parseInt(req.query.wordLength) || DEFAULT_WORD_LENGTH
  const maxAttempts = parseInt(req.query.maxAttempts) || DEFAULT_MAX_ATTEMPTS
  const language = req.query.language || DEFAULT_LANGUAGE
  const authenticatedUser = await getAuthenticatedUser(req.cookies.token)

  const newGame = await generateNewGame(
    language,
    wordLength,
    maxAttempts,
    authenticatedUser
  )
  if (!newGame) {
    return next(new NotFoundError("Failed to generate new game"))
  }
  if (newGame instanceof Error) {
    return next(newGame)
  }

  setCookie(res, {
    name: "game",
    value: newGame,
  })

  return res.json(newGame)
}
