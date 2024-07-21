import { EXACT_MATCH, PARTIAL_MATCH, NO_MATCH } from "../constants.js";
import { buildGameView } from "../views/game.view.js";
import { buildHomeView } from "../views/home.view.js";
import { buildHowToPlayView } from "../views/how-to-play.view.js";
import { buildLoadingView } from "../views/loading.view.js";

/*
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

/*
 * Determines the states of letters (exact, partial, or no match) between to words for updating the on-screen keyboard.
 * @param {string} targetWord - The target word to compare against.
 * @param {object} attemptedWords - An array of attempted words to compare.
 * @return {object} - The states of each letter found.
 */
export const getLetterStates = (gameWord, attemptedWords) => {
  let letterStates = [];

  // Iterate each attempted word in the list of attemptedWords.
  for (let i = 0; i < attemptedWords.length; i++) {
    let word = attemptedWords[i];

    // Iterate each character in the attempted word.
    for (let j = 0; j < word.length; j++) {
      if (gameWord.at(j) === word.at(j)) {
        letterStates[word.at(j)] = EXACT_MATCH;
      } else if (gameWord.includes(word.at(j))) {
        if (letterStates[word.at(j)] === EXACT_MATCH) {
          continue; // Skip this character as it's already been matched.
        }
        letterStates[word.at(j)] = PARTIAL_MATCH;
      } else {
        letterStates[word.at(j)] = NO_MATCH;
      }
    }
  }

  // If there are no matched letters, don't return the empty object
  return Object.keys(letterStates).length > 0 ? letterStates : undefined;
};

/*
 * Clears the current content container's innerHTML and builds view containers.
 * @param {string} name - The name of the view container to build and display.
 * @param {object} options - A list of options that can be passed to views.
 */
export const showView = (name, options) => {
  switch (name) {
    case "game":
      buildGameView({
        game: options.game,
        wordLength: options.wordLength,
        maxAttempts: options.maxAttempts,
        timed: options.timed,
      });
      break;

    case "how-to-play":
      buildHowToPlayView();
      break;

    case "loading":
      buildLoadingView();
      break;

    default:
      buildHomeView();
      break;
  }
};

/*
 * Retrieves the current view from the id tag of the main content container.
 * @return {string} - The name of the current view.
 */
export const getCurrentViewName = () => {
  const currentView = document.querySelector(".content");
  return currentView?.id;
};
