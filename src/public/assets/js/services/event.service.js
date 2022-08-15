import {
  fillNextSquare,
  removeLastSquareValue,
} from "../features/gameboard/gameboard.service.js";
import { forfeitGame, startGame } from "../features/game/game.service.js";
import { processAttempt } from "./attempt.service.js";
import {
  getCurrentViewName,
  showView,
  getViewHistory,
} from "./view.service.js";
import {
  DEFAULT_MAX_ATTEMPTS,
  DEFAULT_WORD_LENGTH,
} from "../utils/constants.js";
import { logoutUser } from "./authentication.service.js";

import { changePassword } from "../features/auth/change-password.js";
import { forgotPassword } from "../features/auth/forgot-password.js";
import { resetPassword } from "../features/auth/reset-password.js";
import { registerUser } from "../features/auth/register.js";
import { login } from "../features/auth/login.js";

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
  howToPlay: () => showView("how-to-play"),
  showLogin: () => showView("login"),
  showRegister: () => showView("register"),
  showForgotPassword: () => showView("forgot-password"),
  showChangePassword: () => showView("change-password"),

  // Games
  startGame: (args) => {
    startGame({
      wordLength: args.wordLength || DEFAULT_WORD_LENGTH,
      maxAttempts: args.maxAttempts || DEFAULT_MAX_ATTEMPTS,
      language: args.languageCode || "enUS",
    });
  },
  forfeitGame: async () => {
    if (window.confirm("Are you sure you want to forfeit the game?")) {
      await forfeitGame();
    }
  },

  // Authentication
  login: async () => await login(),
  register: async () => await registerUser(),
  logout: async () => await logoutUser(),
  changePassword: async () => await changePassword(),
  forgotPassword: () => forgotPassword(), // Don't await so user can't tell if the email is valid.
  resetPassword: async () => await resetPassword(),
};

/**
 * Handles the mapping of button click events to their respective handler functions.
 */
export const handleButtonClick = (event, ...args) => {
  // Verify required event properties and throw an error if they are missing.
  if (!event || !event.target || !event.target.id) {
    console.error("Invalid event or missing button id for handleButtonClick.", {
      event: event,
    });
    return;
  }

  // Extract the button id from the event target and the button name from the button id.
  const buttonId = event.target.id;
  const buttonName = buttonId.replace("Button", "");

  // Verify that the button clicked has a mapped function.
  if (!buttonFunctions.hasOwnProperty(buttonName)) {
    console.error(`${buttonName} does not have a mapped function.`);
    return;
  }

  // Try to extract the button function by its name.
  // If the buttonFn is a function, invoke it. If it's not, throw an error.
  const buttonFn = buttonFunctions[buttonName];
  if (typeof buttonFn === "function") {
    buttonFn(args);
  } else {
    console.error(`Invalid type for ${buttonName}. Expected a function.`);
  }
};

/**
 * Handles the event when a user taps a key on the on-screen keyboard.
 *
 * @param {string} letter The letter entered by the user.
 */
export const clickKeyboardKey = (letter) => {
  if (isBlockKeyEvents()) {
    return;
  }

  if (letter === "delete") {
    removeLastSquareValue();
    return;
  }

  if (letter === "enter") {
    processAttempt();
    return;
  }

  fillNextSquare(letter);
};

/**
 * Add event listeners for global key press events.
 */
export const addKeyListeners = () => {
  // Keypress only listens for keys that emit a value
  document.addEventListener("keypress", function (event) {
    if (isBlockKeyEvents()) {
      return;
    }

    const key = event.key;

    if (key === "Enter") {
      if (
        getCurrentViewName() === "home" ||
        getCurrentViewName() === "how-to-play"
      ) {
        clickStartGameButton();
        return;
      } else if (getCurrentViewName() === "game") {
        processAttempt();
        return;
      }
    }

    fillNextSquare(key);
  });

  // Keydown is for non-value keys as well
  document.addEventListener("keydown", function (event) {
    if (isBlockKeyEvents()) {
      return;
    }

    // Extract the key pressed from the event and remove the last letter if delete or backspace is pressed.
    const key = event.key;
    if (
      (key === "Delete" || key === "Backspace") &&
      getCurrentViewName() === "game"
    )
      removeLastSquareValue(key);
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
