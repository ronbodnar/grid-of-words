import {
  removeSession,
  retrieveSession,
  storeSession,
} from "./shared/services/storage.service.js";
import { addKeyListeners } from "./shared/services/event.service.js";
import { showView } from "./features/view/view.service.js";
import { fetchData, fetchWordList } from "./shared/services/api.service.js";
import { validateResetToken } from "./features/auth/authentication.service.js";
import logger from "./shared/utils/logger.js";
import { DEFAULT_WORD_LENGTH } from "./shared/utils/constants.js";

// Initialize and export the logger
const loggerInstance = logger();
export { loggerInstance as logger };

// Initialize the listeners for keyboard events.
addKeyListeners();

// Show the loading view while we fetch session data from the server.
showView("loading");

(async () => {
  // Fetch the session data from the server.
  const sessionResponse = await fetchData("/auth/session");

  loggerInstance.debug("Session Data", sessionResponse);

  if (sessionResponse?.user && sessionResponse?.user._id) {
    storeSession("user", sessionResponse.user);
  } else {
    removeSession("user");
  }

  if (sessionResponse?.game) {
    storeSession("game", sessionResponse.game);
  } else {
    removeSession("game");
  }

  const game = retrieveSession("game");
  if (game) {
    if (game.maxViews === game.attempts?.length) {
      removeSession("game");
      showView("home");
    } else {
      showView("game", {
        game: game,
      });
    }
  }

  // Fetch the word list in the background
  fetchWordList(DEFAULT_WORD_LENGTH);
})();

// Ensure the session has been set before redirecting the user or they may not have API access.
(async () => {
  // Redirect to the password reset page if the passwordResetToken query parameter is set.
  const searchParams = new URLSearchParams(window.location.search);
  const tokenParam = searchParams.get("token");
  if (tokenParam) {
    // Remove the query parameters from the address bar without reloading the page.
    window.history.replaceState({}, document.title, "/");

    // Validate the passwordResetToken
    const validateTokenResponse = await validateResetToken(tokenParam);
    if (!validateTokenResponse || validateTokenResponse.statusCode !== 200) {
      showView("forgot-password", {
        message:
          validateTokenResponse.message ||
          "The password reset token is invalid. Please request a new token.",
        className: "error",
        hide: false,
      });
      return;
    }

    // Add the reset token to the session (how bad is this?) and swap to the reset password view.
    storeSession("passwordResetToken", tokenParam);
    showView("resetPassword");
  } else {
    const game = retrieveSession("game");
    if (!game) {
      showView("home");
    }
  }
})();
