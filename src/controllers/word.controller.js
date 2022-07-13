import * as wordRepository from "../repository/word.repository.js";

/*
 * Endpoint: /word
 *
 * Select a random word from the word table in the database.
 */
async function getRandomWord(req, res) {
  const length = req.query.wordLength || 5;
  if (!(3 < length < 7)) {
    // ensure length is between 3 and 7 if present
    return res.end();
  }
  const randomWord = await wordRepository.getRandomWord(length);
  return res.json(randomWord);
}

export { getRandomWord };
