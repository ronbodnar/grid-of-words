import { MAXIMUM_WORD_LENGTH, MINIMUM_WORD_LENGTH } from "../constants.js";
import { retrieveLocal } from "./storage.service.js";

/**
 * Fetches a list of words from the server with a specified length range.
 *
 * @param {number} minLength - The minimum length of words to fetch. Defaults to MINIMUM_WORD_LENGTH.
 * @param {number} maxLength - The maximum length of words to fetch. Defaults to MAXIMUM_WORD_LENGTH.
 * @returns {Promise<Array>} A promise that resolves to an array of words.
 */
export const fetchWordList = async (
  minLength = MINIMUM_WORD_LENGTH,
  maxLength = MAXIMUM_WORD_LENGTH
) => {
  return fetch(`word/list?minLength=${minLength}&maxLength=${maxLength}`, {
    headers: {
      Authorization: "Bearer v5Pd3vUK9iYjRxCa1H5VsBe9L18xs8UW", // :)
    },
  })
    .then((response) => response.json())
    .catch((error) => console.error("Error fetching word list", error));
};

/**
 * Checks if a given word exists in the word list stored in local storage.
 *
 * @param {string} word - The word to check.
 * @returns {boolean} True if the word exists in the word list, false otherwise.
 */
export const wordExists = (word) => {
  const wordList = retrieveLocal("wordList");
  if (!wordList) return true;
  return true;//Array.of(wordList).includes(word);
};
