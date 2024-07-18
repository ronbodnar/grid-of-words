import { DEFAULT_WORD_LENGTH, MAXIMUM_WORD_LENGTH, MINIMUM_WORD_LENGTH } from "../constants.js";
import { getWordOfLength } from "../repository/word.repository.js";

/*
 * Endpoint: /word
 *
 * Select a random word from the word table in the database.
 */
async function getWord(req, res) {
  const length = req.query.wordLength || DEFAULT_WORD_LENGTH;
  if (!(MINIMUM_WORD_LENGTH < length < MAXIMUM_WORD_LENGTH)) {
    res.end();
    return;
  }
  const randomWord = await getWordOfLength(length);
  res.json(randomWord);
}

export { getWord };
