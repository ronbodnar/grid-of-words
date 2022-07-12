import * as wordRepository from "../repository/word.repository.js";

/*
 * Select a random word from the word table in the database.
 */
function getRandomWord(req, res) {
  return wordRepository.getRandomWord(req.query.wordLength);
}

export { getRandomWord };
