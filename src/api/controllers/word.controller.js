import { DEFAULT_WORD_LENGTH, MAXIMUM_WORD_LENGTH, MINIMUM_WORD_LENGTH } from "../constants.js";
import { getWordOfLength, getWordsByLengthRange } from "../repository/word.repository.js";

/*
 * Endpoint: /word
 *
 * Select a random word from the word table in the database.
 */
export const getWord = async (req, res) => {
  const length = req.query.wordLength || DEFAULT_WORD_LENGTH;
  if (!(MINIMUM_WORD_LENGTH < length < MAXIMUM_WORD_LENGTH)) {
    res.end({ message: "INVALID WORD LENGTH" });
    return;
  }
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
  const minLength = req.query.minLength || MINIMUM_WORD_LENGTH;
  const maxLength = req.query.maxLength || MAXIMUM_WORD_LENGTH;
  /* const apiKey = req.get('Authorization');
  if (!apiKey || apiKey !== process.env.BEARER_TOKEN) {
    res.end({ message: "INVALID TOKEN" });
    return;
  } */
  if (MINIMUM_WORD_LENGTH > minLength || MAXIMUM_WORD_LENGTH < maxLength || minLength > maxLength) {
    res.end({ message: "MIN OR MAX VALUE OUT OF BOUNDS" });
    return;
  }
  const wordList = await getWordsByLengthRange(minLength, maxLength);
  return res.json(wordList);
}