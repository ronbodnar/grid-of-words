import {
  removeSession,
  retrieveLocal,
  retrieveSession,
  storeSession,
} from "../../shared/services/storage.service.js"
import { showView } from "../view/view.service.js"
import {
  DEFAULT_MAX_ATTEMPTS,
  DEFAULT_WORD_LENGTH,
} from "../../shared/utils/constants.js"
import { toggleKeyboardOverlay } from "../game/keyboard/keyboard.service.js"
import { showMessage } from "../../shared/services/message.service.js"
import { fetchData } from "../../shared/services/api.service.js"
import { logger } from "../../main.js"
import { clearAttemptLetters } from "./attempt/attempt.service.js"
import OPTIONS from "../options/enums/Options.js"

/**
 * Begins a new game by querying the API for a new game object, then swaps the container view to show the game container.
 *
 * @async
 * @param {Object} options - An object of options to pass when creating a game.
 */
export const startGame = async (options = {}) => {
  showView("loading")

  const { wordLength, maxAttempts, language } = options
  const preferredLanguage = retrieveLocal(OPTIONS.LANGUAGE.id)
  const preferredWordLength = retrieveLocal(OPTIONS.WORD_LENGTH.id)
  const preferredMaxAttempts = retrieveLocal(OPTIONS.MAX_ATTEMPTS.id)

  const gameOptions = {
    language: language || preferredLanguage || "english",
    wordLength: wordLength || preferredWordLength || DEFAULT_WORD_LENGTH,
    maxAttempts: maxAttempts || preferredMaxAttempts || DEFAULT_MAX_ATTEMPTS,
  }

  try {
    const params = new URLSearchParams(gameOptions)
    const fetchNewGameResponse = await fetchData(
      `/game/new?${params.toString()}`,
      "GET"
    )

    if (
      !fetchNewGameResponse?.payload ||
      fetchNewGameResponse.statusCode !== 200
    ) {
      logger.error("Failed to fetch a new game", {
        params: params,
        fetchNewGameResponse: fetchNewGameResponse,
      })
      showView("home", {
        message: {
          text: "An unknown error has occurred. Please try again.",
          className: "error",
          hideDelay: 10000,
        },
      })
      return
    }

    clearAttemptLetters()

    showView("game", gameOptions)

    storeSession("game", fetchNewGameResponse.payload)

    logger.info("Created Game Response", fetchNewGameResponse.payload)
  } catch (error) {
    logger.error("Error creating new game", {
      error: error,
    })
    showView("home", {
      message: {
        text: "An unknown error has occurred. Please try again.",
        className: "error",
        hideDelay: 10000,
      },
    })
  }
}

/**
 * Abandons the current game by sending a request to the server and updating the UI.
 *
 * @async
 * @returns {Object|undefined} The response from the server if the game was abandoned successfully, or `undefined` if there was an error.
 */
export const abandonGame = async () => {
  const game = retrieveSession("game")

  showMessage("Abandoning game - please wait.")
  toggleKeyboardOverlay()

  const abandonGameResponse = await fetchData(
    `/game/${game._id}/abandon`,
    "POST"
  )

  if (!abandonGameResponse?.payload || abandonGameResponse.statusCode !== 200) {
    logger.error("Failed to abandon game", {
      game: game,
      abandonGameResponse: abandonGameResponse,
    })
    showMessage(
      "Failed to abandon game. Please try again or complete the game."
    )
    toggleKeyboardOverlay()
    return
  }
  storeSession("showStatistics", true)
  removeSession("game")
  showView("home")

  return abandonGameResponse.payload
}
