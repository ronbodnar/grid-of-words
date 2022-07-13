import { Word } from "../models/Word.class.js";
import * as database from "../services/database.service.js";

/*
 * Selects a random word with the specified length from the database.
 *
 * @param {number} length - The length of the word to be found.
 * @return {Word} word - An instance of the Word.
 */
async function getRandomWord(length) {
  var sql = `SELECT * FROM words WHERE CHAR_LENGTH(word) = ? ORDER BY RAND() LIMIT 1`;
  const data = await database.query(sql, [length]);
  if (data == null) return null;
  const word = new Word(data[0][0].id, data[0][0].word);
  return word;
}

/*
 * Searches the database for the provided word.
 *
 * @param {string} word - The word to search for.
 * @return {boolean}
 */
async function exists(word) {
  var sql = `SELECT COUNT(*) AS count FROM words WHERE word = ?`;
  const response = await database.query(sql, [word]);
  try {
    return response[0][0].count > 0;
  } catch (error) {
    // this should only error when there are no results
    console.error(error);
    return false;
  }
}

export { exists, getRandomWord };
