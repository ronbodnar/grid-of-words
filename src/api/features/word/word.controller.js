import InternalError from "../../errors/InternalError.js";
import { DEFAULT_WORD_LENGTH } from "../../shared/constants.js"
import { getWord, getWordList } from "./word.service.js";

/**
 * Select a random word from the word table in the database.
 *
 * Endpoint: GET /word
 *
 * @returns {Promise<any>} A promise that resolves with a random word if successful.
 */
export const handleGetWord = async (req, res) => {
  const length = req.query.wordLength || DEFAULT_WORD_LENGTH;

  const randomWord = await getWord(length);
  return res.json(randomWord);
};

/**
 * Retrieves the list of words of a given length.
 *
 * Endpoint: GET /word/list
 *
 * @returns {Promise<Array | InternalError>} A promise that resolves to an Array of words with the specified length or an Error.
 */
export const handleGetWordList = async (req, res) => {
  try {
    const length = parseInt(req.query.length) || DEFAULT_WORD_LENGTH;
    const wordList = await getWordList(length);
    return res.json(wordList);
  } catch (error) {
    throw new InternalError("Failed to fetch word list", {
      error: error
    });
  }
};
