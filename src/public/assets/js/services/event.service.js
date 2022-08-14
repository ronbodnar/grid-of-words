import { fillNextSquare, removeLastSquareValue } from "../features/gameboard/gameboard.service.js";
import { forfeitGame, startGame } from "../features/game/game.service.js";
import { processAttempt } from "./attempt.service.js";
import { getCurrentViewName, showView, getViewHistory } from "./view.service.js";
import {
  DEFAULT_MAX_ATTEMPTS,
  DEFAULT_WORD_LENGTH,
} from "../utils/constants.js";
import {
  logoutUser,
} from "./authentication.service.js";

import { changePassword } from "../features/auth/change-password.js";
import { forgotPassword } from "../features/auth/forgot-password.js";
import { resetPassword } from "../features/auth/reset-password.js";
import { registerUser } from "../features/auth/register.js";
import { login } from "../features/auth/login.js";

//TODO: this has too many functions that belong in other modules.

// When we are performing certain tasks, we don't want to accept user input and block it conditionally.
var blockKeyEvents = false;

/**
 * Add event listeners for global key press events.
 */
export const addKeyListeners = () => {
  // Keypress only listens for keys that emit a value
  document.addEventListener("keypress", function (event) {
    if (blockKeyEvents) {
      return;
    }

    const key = event.key;

    if (key === "Enter") {
      if (getCurrentViewName() === "home" || getCurrentViewName() === "how-to-play") {
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
    if (blockKeyEvents) {
      return;
    }

    // Extract the key pressed from the event and remove the last letter if delete or backspace is pressed.
    const key = event.key;
    if ((key === "Delete" || key === "Backspace") && getCurrentViewName() === "game") removeLastSquareValue(key);
  });
};

/**
 * Handles the event when a user taps a key on the on-screen keyboard.
 *
 * @param {string} letter The letter entered by the user.
 */
export const clickKeyboardKey = (letter) => {
  if (blockKeyEvents) {
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
 * Prompts the user if they'd like to forfeit, then forfeits or closes depending on the user's choice.
 */
export const clickForfeitGameButton = async () => {
  if (window.confirm("Are you sure you want to forfeit the game?"))
    await forfeitGame();
};

/**
 * Begins a new game.
 */
export const clickStartGameButton = (
  event, // required parameter since we are using additional parameters with the event listener callback
  wordLength = DEFAULT_WORD_LENGTH,
  maxAttempts = DEFAULT_MAX_ATTEMPTS
) => {
  startGame({
    wordLength: wordLength,
    maxAttempts: maxAttempts,
    language: "enUS",
  });
};

/**
 * Shows the home view when the user clicks the back button element generated in views.
 */
export const clickBackButton = () => {
  // Pop the previous view name from the view history stack.
  const previousView = getViewHistory().pop();
  showView(previousView, {
    hideFromHistory: true,
  });
};

/**
 * Shows the options view when the user clicks the options button.
 */
export const clickOptionsButton = () => {
  showView("options");
};

/**
 * Shows the how to play view when the user clicks the how to play button.
 */
export const clickHowToPlayButton = () => {
  showView("how-to-play");
};

/**
 * Tries to authenticate with the server using the input username and password.
 */
export const clickLoginButton = async () => {
  await login();
};

/**
 * TODO: handle logic for registration
 */
export const clickRegisterButton = async () => {
  await registerUser();
};

export const clickChangePasswordButton = async () => {
  await changePassword();
};

export const clickForgotPasswordButton = async () => {
  // Because we don't want the user to see delays when we find a valid email address, don't await this function.
  forgotPassword();
};

export const clickResetPasswordButton = async () => {
  await resetPassword();
};

export const clickLoginMessage = async (event) => {
  const targetId = event.target.id;
  if (!targetId) return;

  if (targetId === "loginButton") {
    showView("login");
  } else if (targetId === "logoutButton") {
    //TODO: loading animation & blocking events
    await logoutUser();
  } else if (targetId === "registerButton") {
    showView("register");
  } else if (targetId === "forgotPasswordButton") {
    showView("forgot-password");
  } else if (targetId === "changePassword") {
    showView("change-password");
  } else {
    console.log("Unknown event target:", targetId);
  }
};

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
