import * as database from "../services/database.service.js";
import * as wordRepository from "../repository/word.repository.js";

/*
 * Selects a random word from the word table in the database.
 * TODO: add support for word lengths and other filters
 */
async function getRandomWord(req, res) {
  return wordRepository.getRandomWord(req, res);
}

export { getRandomWord };
