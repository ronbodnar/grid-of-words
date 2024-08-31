import {
  MAXIMUM_WORD_LENGTH,
  MINIMUM_WORD_LENGTH,
} from "../../shared/constants.js"
import InternalError from "../../errors/InternalError.js"
import ValidationError from "../../errors/ValidationError.js"
import { findWordByLength, findAllWordsByLength } from "./word.repository.js"

/**
 * Select a random word from the word table in the database.
 *
 * @async
 * @param {Number} length The length of the word to select.
 * @returns {Promise<string|InternalError|ValidationError>} A promise that resolves to the random word.
 */
export const getWord = async (length, language) => {
  if (!length) {
    return new InternalError("Missing required parameter: length")
  }
  if (!(MINIMUM_WORD_LENGTH <= length && length <= MAXIMUM_WORD_LENGTH)) {
    return new ValidationError("Word length is out of bounds")
  }
  const randomWord = findWordByLength(length, language)
  return randomWord
}

/**
 * Obtains a list of words matching the specified `length`.
 *
 * @async
 * @param {Number} length The length of words to search for.
 * @returns {Promise<Array<string>>} A promise that resolves to an Array of words matching the specified `length`.
 */
export const getWordList = async (length, language) => {
  const validLength =
    MINIMUM_WORD_LENGTH <= length && length <= MAXIMUM_WORD_LENGTH
  if (!validLength) {
    return new ValidationError("Word length is out of bounds")
  }
  const wordList = findAllWordsByLength(length, language)
  return wordList
}
