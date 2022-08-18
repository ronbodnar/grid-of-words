import {
  removeSession,
  retrieveLocal,
  retrieveSession,
  storeLocal,
  storeSession,
} from "./shared/services/storage.service.js";
import { addKeyListeners } from "./shared/services/event.service.js";
import { getCurrentViewName, showView } from "./features/view/view.service.js";
import { fetchData, fetchWordList } from "./shared/services/api.service.js";
import { validateResetToken } from "./features/auth/authentication.service.js";

// Initialize and export the logger
const loggerInstance = logger();
export { loggerInstance as logger };

// Initialize the listeners for keyboard events.
addKeyListeners();

// Show the loading view while we fetch session data from the server.
showView("loading");

(async () => {
  // Fetch the session data from the server.
  const sessionResponse = await fetchData("/session");

  loggerInstance.debug("Session Data", sessionResponse);

  if (sessionResponse?.user && sessionResponse?.user.id) {
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
    showView("game", {
      game: game,
    });
  }

  // Ensure the user has the word list in the local storage, if not, asynchronously fetch and store the word list.
  const wordList = retrieveLocal("wordList");
  if (!wordList) {
    fetchWordList()
      .then((response) => storeLocal("wordList", response))
      .catch((error) => loggerInstance.error("Error fetching word list", error));
  }
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
    showView("reset-password");
  } else {
    // Only show home if we aren't already in a game.
    if (getCurrentViewName() !== "game") {
      showView("home");
    }
  }
})();
