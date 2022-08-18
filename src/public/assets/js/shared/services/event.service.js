import {
  fillNextSquare,
  removeLastSquareValue,
} from "../../features/gameboard/gameboard.service.js";
import { forfeitGame, startGame } from "../../features/game/game.service.js";
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

const buttonFunctions = {
  // Navigation
  back: () => {
    // Pop the previous view name from the view history stack.
    const previousView = getViewHistory().pop();
    showView(previousView, {
      hideFromHistory: true,
    });
  },
  options: () => showView("options"),
  howToPlay: () => showView("howToPlay"),
  showLogin: () => showView("login"),
  showRegister: () => showView("register"),
  showForgotPassword: () => showView("forgotPassword"),
  showChangePassword: () => showView("changePassword"),

  // Games
  startGame: (args) => {
    logger.info("Starting game with arguments", {
      arguments: args,
    });
    startGame({
      wordLength: args?.wordLength || DEFAULT_WORD_LENGTH,
      maxAttempts: args?.maxAttempts || DEFAULT_MAX_ATTEMPTS,
      language: args?.languageCode || "enUS",
    });
  },
  forfeitGame: async () => {
    if (window.confirm("Are you sure you want to forfeit the game?")) {
      await forfeitGame();
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
 * Maps click events to their respective handler functions and invokes the function.
 */
export const handleClickEvent = (event, args) => {
  // Ensure the event is defined. If not, log an error and return early.
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

  const buttonName = targetId.replace("Button", "");
  if (!buttonFunctions.hasOwnProperty(buttonName)) {
    throw new Error(`${buttonName} does not have a mapped function`);
  }

  const buttonFunction = buttonFunctions[buttonName];
  if (typeof buttonFunction === "function") {
    buttonFunction(args);
  } else {
    throw new Error(`Invalid type for ${buttonName}. Expected a function`);
  }
};

/**
 * Handles the event when a user taps/clicks a key on the on-screen keyboard.
 *
 * @param {string} letter The letter entered by the user.
 */
export const clickKeyboardKey = (letter) => {
  // Exit early if key events are blocked.
  if (isBlockKeyEvents()) return;

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
          buttonFunctions.startGame();
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
