import { EXACT_MATCH, PARTIAL_MATCH, NO_MATCH } from "./constants.js";

/**
 * Compares two words of assumed equal length to see which guessWord letter positions match, are invalid, or don't exist in the gameWord.
 *
 * @param {string} guessWord - The word to compare against the known correct word.
 * @param {string} targetWord - The known word to compare against.
 * @returns {list} - The in-order list of the guessWord letters placement validation.
 */
export const getValidatedLetters = (guessWord, targetWord) => {
  if (targetWord.length !== guessWord.length) {
    throw new Error("Length mismatch");
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
 *
 * @param {string} targetWord - The target word to compare against.
 * @param {object} attemptedWords - An array of attempted words to compare.
 * @returns {object} - The states of each letter found.
 */
export const getLetterStates = (gameWord, attemptedWords) => {
  let letterMatchStates = [];

  for (let i = 0; i < attemptedWords.length; i++) {
    let word = attemptedWords[i];

    for (let j = 0; j < word.length; j++) {
      let wordMatchState;
      if (gameWord.at(j) === word.at(j)) {
        wordMatchState = EXACT_MATCH;
      } else if (gameWord.includes(word.at(j))) {
        if (wordMatchState === EXACT_MATCH) {
          continue; // Skip this character as it's already been matched.
        }
        wordMatchState = PARTIAL_MATCH;
      } else {
        wordMatchState = NO_MATCH;
      }
      letterMatchStates[word.at(j)] = wordMatchState;
    }
  }

  // If there are no matched letters, return null instead of the letterMatchStates.
  return Object.keys(letterMatchStates).length > 0 ? letterMatchStates : null;
};

/**
 * Gets a random integer between the specified min and max range.
 *
 * @param {number} min - The minimum value for the random integer.
 * @param {number} max - The maximum value for the random integer.
 * @returns {number} - The random numer.
 */
export const getRandomInt = (min, max) => {
  return Math.floor(Math.random() * (max - min) + min);
};

/**
 * Converts the given string-containing-hyphens or spaces into camelCase.
 *
 * @param {string} str The string to be converted.
 * @returns {string} The camelCase representation of the given string.
 */
export const convertToCamelCase = (str) => {
  return str
    .toLowerCase()
    .replace(/[- ](.)/g, (_, group1) => group1.toUpperCase());
};
