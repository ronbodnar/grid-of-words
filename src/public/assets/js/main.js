import {
  removeSession,
  retrieveLocal,
  retrieveSession,
  storeSession,
} from "./shared/services/storage.service.js"
import { addKeyListeners } from "./shared/services/event.service.js"
import { showView } from "./features/view/view.service.js"
import { fetchData, fetchWordList } from "./shared/services/api.service.js"
import { validateResetToken } from "./features/auth/authentication.service.js"
import logger from "./shared/utils/logger.js"
import { DEFAULT_WORD_LENGTH } from "./shared/utils/constants.js"

// Initialize and export the logger
const loggerInstance = logger()
export { loggerInstance as logger }

// Initialize the listeners for keyboard events.
addKeyListeners()

// Show the loading view while we fetch session data from the server.
showView("loading")

// Fetch the session data from the server before moving on.
await (async () => {
  const sessionResponse = await fetchData("/session")

  const { user, game } = sessionResponse?.payload || {}

  loggerInstance.debug("Session Data", sessionResponse)

  if (user?._id) {
    storeSession("user", user)
  } else {
    removeSession("user")
  }

  if (game) {
    storeSession("game", game)
  } else {
    removeSession("game")
  }

  const localGame = retrieveSession("game")
  if (localGame) {
    if (localGame.maxViews === localGame.attempts?.length) {
      removeSession("game")
    } else {
      showView("game", {
        game: localGame,
      })
    }
  }

  const preferredLanguage = retrieveLocal("language")
  // Fetch the word list in the background if it doesn't exist.
  fetchWordList(DEFAULT_WORD_LENGTH, preferredLanguage || "english")
})()

// Ensure the session has been set before redirecting the user or they may not have API access.
;(async () => {
  // Redirect to the password reset page if the passwordResetToken query parameter is set.
  const searchParams = new URLSearchParams(window.location.search)
  const tokenParam = searchParams.get("token")
  if (tokenParam) {
    // Remove the query parameters from the address bar without reloading the page.
    window.history.replaceState({}, document.title, "/")

    // Validate the passwordResetToken
    const validateTokenResponse = await validateResetToken(tokenParam)
    if (
      !validateTokenResponse?.payload ||
      validateTokenResponse.statusCode !== 200
    ) {
      showView("forgotPassword", {
        message:
          validateTokenResponse.payload.message ||
          "The password reset token is invalid. Please request a new token.",
        className: "error",
        hide: false,
      })
      return
    }

    // Add the reset token to the session (how bad is this?) and swap to the reset password view.
    storeSession("passwordResetToken", tokenParam)
    showView("resetPassword")
  } else {
    const game = retrieveSession("game")
    if (!game) {
      showView("home")
    }
  }
})()
