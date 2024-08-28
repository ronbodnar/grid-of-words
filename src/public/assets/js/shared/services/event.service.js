import {
  fillNextSquare,
  removeLastSquareValue,
} from "../../features/gameboard/gameboard.service.js";
import { abandonGame, startGame } from "../../features/game/game.service.js";
import { processAttempt } from "../../features/attempts/attempt.service.js";
import {
  getCurrentViewName,
  showView,
  getViewHistory,
} from "../../features/view/view.service.js";
import {
  DEFAULT_MAX_ATTEMPTS,
  DEFAULT_WORD_LENGTH,
} from "../utils/constants.js";
import {
  changePassword,
  forgotPassword,
  resetPassword,
  login,
  logout,
  register,
} from "../../features/auth/authentication.service.js";
import { logger } from "../../main.js";

const clickFunctions = {
  // Navigation
  options: () => showView("options"),
  howToPlay: () => showView("howToPlay"),
  statistics: () => showView("statistics"),
  showLogin: () => showView("login"),
  showRegister: () => showView("register"),
  showForgotPassword: () => showView("forgotPassword"),
  showChangePassword: () => showView("changePassword"),
  back: () => {
    const previousView = getViewHistory().pop();
    showView(previousView, {
      hideFromHistory: true,
    });
  },

  // Games
  startGame: (args) => {
    const { wordLength, maxAttempts, languageCode } = args;
    logger.debug("Starting game with arguments", {
      arguments: args,
    });
    startGame({
      wordLength: wordLength || DEFAULT_WORD_LENGTH,
      maxAttempts: maxAttempts || DEFAULT_MAX_ATTEMPTS,
      language: languageCode || "enUS",
    });
  },
  abandonGame: async () => {
    if (window.confirm("Are you sure you want to abandon the game?")) {
      await abandonGame();
    }
  },

  // On-screen keyboard key events
  key: (args) => {
    const { letter } = args;
    switch (letter) {
      case "delete":
        removeLastSquareValue();
        break;

      case "enter":
        processAttempt();
        break;

      default:
        fillNextSquare(letter);
        break;
    }
  },

  // Authentication
  login: async () => await login(),
  register: async () => await register(),
  logout: async () => await logout(),
  changePassword: async () => await changePassword(),
  forgotPassword: () => forgotPassword(), // Don't await so user can't tell if the email is valid.
  resetPassword: async () => await resetPassword(),
};

/**
 * Handles the event when a user taps/clicks a square on the gameboard by invoking the mappped function.
 *
 * @param {Event} event The click event.
 * @param {string} letter The letter entered by the user.
 */
export const handleClickEvent = (event, args) => {
  if (!event) {
    throw new Error("Missing event parameter");
  }

  const targetId = event.target?.id || event.target?.parentElement?.id;
  if (!targetId) {
    throw new Error(
      "Invalid event or missing button id for handleButtonClick.",
      {
        event: event,
      }
    );
  }

  const targetName = targetId.replace("Button", "").replace(/-[a-z]{1,}/g, "");
  if (!Object.hasOwn(clickFunctions, targetName)) {
    throw new Error(`${targetName} does not have a mapped function`);
  }

  const fn = clickFunctions[targetName];
  if (typeof fn === "function") {
    fn(args);
  } else {
    throw new Error(`Invalid type for ${targetName}. Expected a function`);
  }
};

/**
 * Add event listeners for global key press events.
 */
export const addKeyListeners = () => {
  // Keypress only listens for keys that emit a value
  document.addEventListener("keypress", function (event) {
    // Exit early if key events are blocked.
    if (isBlockKeyEvents()) return;

    const { key } = event;
    const currentView = getCurrentViewName();

    if (key === "Enter") {
      switch (currentView) {
        case "home":
        case "howToPlay":
          clickFunctions.startGame();
          break;

        case "game":
          processAttempt();
          break;
      }
    } else {
      fillNextSquare(key);
    }
  });

  // Keydown is for non-value keys as well
  document.addEventListener("keydown", function (event) {
    // Exit early if key events are blocked.
    if (isBlockKeyEvents()) return;

    const { key } = event;
    const isDeleteKey = key === "Delete" || key === "Backspace";
    const currentView = getCurrentViewName();

    if (isDeleteKey && currentView === "game") {
      removeLastSquareValue(key);
    }
  });
};

// When we are performing certain tasks, we don't want to accept user input and block it conditionally.
var blockKeyEvents = false;

/**
 * Enable or disable the blocking of key events during animations.
 *
 * @param {boolean} block - True to block key events, false to allow them.
 */
export const setBlockKeyEvents = (block) => {
  blockKeyEvents = block;
};

/**
 * Checks whether or not key events are being blocked.
 *
 * @return {boolean} true if events are being blocked, otherwise false.
 */
export const isBlockKeyEvents = () => {
  return blockKeyEvents;
};
