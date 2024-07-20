import { DEFAULT_WORD_LENGTH, MAXIMUM_WORD_LENGTH, MINIMUM_WORD_LENGTH } from "../constants.js";
import { getWordOfLength, getWordsByLengthRange } from "../repository/word.repository.js";

/*
 * Endpoint: /word
 *
 * Select a random word from the word table in the database.
 */
async function getWord(req, res) {
  const length = req.query.wordLength || DEFAULT_WORD_LENGTH;
  if (!(MINIMUM_WORD_LENGTH < length < MAXIMUM_WORD_LENGTH)) {
    res.end({ message: "Invalid word length." });
    return;
  }
  const randomWord = await getWordOfLength(length);
  res.json(randomWord);
}

async function getWordList(req, res) {
  const minLength = req.query.minLength || MINIMUM_WORD_LENGTH;
  const maxLength = req.query.maxLength || MAXIMUM_WORD_LENGTH;
  if (MINIMUM_WORD_LENGTH > minLength || MAXIMUM_WORD_LENGTH < maxLength || minLength > maxLength) {
    res.end({ message: "Invalid word length range." });
    return;
  }
  const wordList = await getWordsByLengthRange(minLength, maxLength);
  res.json(wordList);
}

export { getWord, getWordList };
