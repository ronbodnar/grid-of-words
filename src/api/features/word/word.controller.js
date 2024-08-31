import InternalError from "../../errors/InternalError.js";
import { DEFAULT_WORD_LENGTH } from "../../shared/constants.js";
import { getWord, getWordList } from "./word.service.js";

/**
 * Handles the selection of a random word.
 *
 * Endpoint: GET /word
 *
 * @async
 */
export const handleGetWord = async (req, res) => {
  const length = req.query.wordLength || DEFAULT_WORD_LENGTH;

  const randomWord = await getWord(length);
  return res.json(randomWord);
};

/**
 * Handles retrieval of word lists.
 *
 * Endpoint: GET /word/list
 *
 * @async
 */
export const handleGetWordList = async (req, res) => {
  try {
    const length = parseInt(req.query.length) || DEFAULT_WORD_LENGTH;
    const wordList = await getWordList(length);
    return res.json(wordList);
  } catch (error) {
    throw new InternalError("Failed to fetch word list", {
      error: error,
    });
  }
};
