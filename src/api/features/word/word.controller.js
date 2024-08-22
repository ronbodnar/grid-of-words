import { InternalError } from "../../errors/index.js";
import { DEFAULT_WORD_LENGTH } from "../../shared/constants.js";
import { wordService } from "./index.js";

/**
 * Select a random word from the word table in the database.
 *
 * Endpoint: GET /word
 *
 * @returns {Promise<any>} A promise that resolves with a random word if successful.
 */
export const getRandomWord = async (req, res, next) => {
  const length = req.query.wordLength || DEFAULT_WORD_LENGTH;

  const randomWord = await wordService.getWord(length);
  return res.json(randomWord);
};

/**
 * Retrieves the list of words of a given length.
 *
 * Endpoint: GET /word/list
 *
 * @returns {Promise<Array | InternalError>} A promise that resolves to an Array of words with the specified length or an Error.
 */
export const getWordList = async (req, res, next) => {
  try {
    const length = parseInt(req.query.length) || DEFAULT_WORD_LENGTH;
    const wordList = await wordService.getWordList(length);
    return res.json(wordList);
  } catch (error) {
    throw new InternalError("Failed to fetch word list");
  }
};
