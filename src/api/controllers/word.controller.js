import { DEFAULT_WORD_LENGTH, MAXIMUM_WORD_LENGTH, MINIMUM_WORD_LENGTH } from "../constants.js";
import { getWordOfLength, getWordsByLengthRange } from "../repository/word.repository.js";

/*
 * Endpoint: /word
 *
 * Select a random word from the word table in the database.
 */
export const getWord = async (req, res) => {
  const length = req.query.wordLength || DEFAULT_WORD_LENGTH;

  // Ensure the length is within the allowed range.
  if (!(MINIMUM_WORD_LENGTH <= length && length <= MAXIMUM_WORD_LENGTH)) {
    res.json({ message: "INVALID WORD LENGTH" });
    return;
  }

  // Synchronously retrieve the word from the database.
  const randomWord = await getWordOfLength(length);
  return res.json(randomWord);
}
/*
 * Endpoint: /word/list
 *
 * Retrieves the list of words between a min-max value range.
 * @return {Array} A list of words within the min-max range.
 */
export const getWordList = async (req, res) => {
  const length = req.query.length;
  const minLength = req.query.minLength || MINIMUM_WORD_LENGTH;
  const maxLength = req.query.maxLength || MAXIMUM_WORD_LENGTH;

  // Ensure the length is within the allowed range.
  if (length && !(MINIMUM_WORD_LENGTH <= length && length <= MAXIMUM_WORD_LENGTH)) {
    res.json({ message: "INVALID WORD LENGTH" });
    return;
  }

  // Ensure the minLength is within the minimum length and the maxLength parameter.
  if (!(MINIMUM_WORD_LENGTH <= minLength && minLength <= maxLength)) {
    res.json({ message: "MIN VALUE OUT OF BOUNDS" });
    return;
  }

  // Ensure the maxLength is within the allowed range.
  if (!(MINIMUM_WORD_LENGTH <= maxLength && maxLength <= MAXIMUM_WORD_LENGTH)) {
    res.json({ message: "MAX VALUE OUT OF BOUNDS" });
    return;
  }

  // Synchronously retrieve the word list from the database. If length is set it will be used.
  const wordList = await getWordsByLengthRange((length || minLength), (length || maxLength));
  return res.json(wordList);
}