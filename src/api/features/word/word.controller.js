import { ValidationError } from "../../errors/ValidationError.js";
import {
  DEFAULT_WORD_LENGTH,
} from "../../shared/constants.js";
import wordService from "./word.service.js";

/**
 * Select a random word from the word table in the database.
 *
 * Endpoint: /word
 *
 * @returns {Promise<any>} A promise that resolves with a random word if successful.
 */
const getWord = async (req, res, next) => {
  const length = req.query.wordLength || DEFAULT_WORD_LENGTH;

  const word = await wordService.getWord(length);

  return res.json(word);
};

/**
 * Retrieves the list of words between a min-max value range.
 *
 * Endpoint: /word/list
 *
 * @returns {Promise<Array>} A promise that resolves to an Array of words with the specified length or within the min-max range.
 */
const getWordList = async (req, res, next) => {
  const length = req.query.length || DEFAULT_WORD_LENGTH;

  const wordList = await wordService.getWordList(length);

  console.log("wordList", wordList);
  return res.json(wordList);
};

export default {
  getWord,
  getWordList,
};
