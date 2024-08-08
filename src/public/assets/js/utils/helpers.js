import { EXACT_MATCH, PARTIAL_MATCH, NO_MATCH } from "../constants.js";
import { buildForgotPasswordView } from "../views/auth/forgot-password.view.js";
import { buildGameView } from "../views/game.view.js";
import { buildHomeView } from "../views/home.view.js";
import { buildHowToPlayView } from "../views/how-to-play.view.js";
import { buildLoadingView } from "../views/loading.view.js";
import { buildLoginView } from "../views/auth/login.view.js";
import { buildOptionsView } from "../views/options.view.js";
import { buildRegisterView } from "../views/auth/register.view.js";
import { buildResetPasswordView } from "../views/auth/reset-password.view.js";
import { buildChangePasswordView } from "../views/auth/change-password.view.js";

/**
 * Compares two words of assumed equal length to see which guessWord letter positions match, are invalid, or don't exist in the gameWord.
 * @param {string} guessWord - The word to compare against the known correct word.
 * @param {string} targetWord - The known word to compare against.
 * @return {list} - The in-order list of the guessWord letters placement validation.
 */
export const getValidatedLetters = (guessWord, targetWord) => {
  if (targetWord.length !== guessWord.length) {
    console.error("Words must be of the same length");
    return null;
  }

  const length = targetWord.length;
  const results = new Array(length).fill(NO_MATCH);
  const targetCount = {};
  const usedCount = {};

  // Perform a pass for all correctly positioned letters and update target counts for remaining letters
  for (let i = 0; i < length; i++) {
    const targetChar = targetWord[i];
    if (guessWord[i] === targetChar) {
      results[i] = EXACT_MATCH;
    } else {
      targetCount[targetChar] = (targetCount[targetChar] || 0) + 1;
    }
  }

  // Perform a pass for all incorrectly positioned letters
  for (let i = 0; i < length; i++) {
    if (results[i] === 1) continue;

    const guessChar = guessWord[i];

    if (targetCount[guessChar] > (usedCount[guessChar] || 0)) {
      results[i] = PARTIAL_MATCH;
      usedCount[guessChar] = (usedCount[guessChar] || 0) + 1;
    }
  }

  return results;
};

/**
 * Determines the states of letters (exact, partial, or no match) between to words for updating the on-screen keyboard.
 * @param {string} targetWord - The target word to compare against.
 * @param {object} attemptedWords - An array of attempted words to compare.
 * @return {object} - The states of each letter found.
 */
export const getLetterStates = (gameWord, attemptedWords) => {
  let letterMatchStates = [];

  // Iterate each attempted word in the list of attemptedWords.
  for (let i = 0; i < attemptedWords.length; i++) {
    let word = attemptedWords[i];

    // Iterate each character in the attempted word.
    for (let j = 0; j < word.length; j++) {
      if (gameWord.at(j) === word.at(j)) {
        // The letters match.
        letterMatchStates[word.at(j)] = EXACT_MATCH;
      } else if (gameWord.includes(word.at(j))) {
        // The letter is in the gameWord.
        if (letterMatchStates[word.at(j)] === EXACT_MATCH) {
          // The letter was already found previously as an exact match, so skip it.
          continue; // Skip this character as it's already been matched.
        }
        letterMatchStates[word.at(j)] = PARTIAL_MATCH;
      } else {
        // The letter was not found.
        letterMatchStates[word.at(j)] = NO_MATCH;
      }
    }
  }

  // If there are no matched letters, return null instead of the letterMatchStates.
  return Object.keys(letterMatchStates).length > 0
    ? letterMatchStates
    : null;
};

// The stack of views so that the back button can return the user to where they were (does not keep previous states).
export var viewHistory = [];

/**
 * Clears the current content container's innerHTML and builds view containers.
 * @param {string} name - The name of the view container to build and display.
 * @param {object} options - A list of options that can be passed to views.
 */
export const showView = (name, options) => {
  // If loading view timeout is in effect, add a timeout for the new view
  if (!name || name === "") {
    console.error("No view name provided");
    return;
  }

  // Do not add to history when current view is "loading" or when options.hideFromHistory is true.
  if (getCurrentViewName() !== "loading") {
    if (!options?.hideFromHistory) {
      viewHistory.push(getCurrentViewName());
    }
  }

  //console.log("View history after showView: ", viewHistory);
  switch (name) {
    case "game":
      buildGameView({
        game: options.game,
        wordLength: options.wordLength,
        maxAttempts: options.maxAttempts,
      });

      // Reset the view history.
      viewHistory = [];
      break;

    case "how-to-play":
      buildHowToPlayView();
      break;

    case "loading":
      buildLoadingView();
      break;

    case "options":
      buildOptionsView();
      break;

    case "login":
      buildLoginView((options?.success || undefined));
      break;

    case "register":
      buildRegisterView();
      break;

    case "forgot-password":
      buildForgotPasswordView();
      break;

    case "reset-password":
      buildResetPasswordView();
      break;

    case "change-password":
      buildChangePasswordView();
      break;

    default:
      buildHomeView();
      break;
  }
};

/**
 * Retrieves the current view from the id tag of the main content container.
 * @return {string} - The name of the current view.
 */
export const getCurrentViewName = () => {
  const currentView = document.querySelector(".content");
  return currentView?.id;
};

/**
 * Gets a random integer between the specified min and max range.
 * @param {number} min - The minimum value for the random integer.
 * @param {number} max - The maximum value for the random integer.
 * @return {number} - The random numer.
 */
export const getRandomInt = (min, max) => {
  return Math.floor(Math.random() * (max - min) + min);
};