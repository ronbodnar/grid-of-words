import { Word } from "../models/Word.class.js";
import query from "../services/database.service.js";

/*
 * Selects a random word with the specified length from the database.
 *
 * @param {number} length - The length of the word to be found.
 * @return {Word} word - An instance of the Word.
 */
async function getWordOfLength(length) {
  var sql = `SELECT * FROM words WHERE CHAR_LENGTH(word) = ? ORDER BY RAND() LIMIT 1`;
  const data = await query(sql, [length]);
  if (data == null) return null;
  const word = new Word(data[0][0].id, data[0][0].word);
  return word;
}

async function getWordsByLengthRange(minLength, maxLength) {
  var sql = `SELECT word, LENGTH(word) AS length FROM words HAVING length >= ? AND length <= ?`;
  const data = await query(sql, [minLength, maxLength]);
  if (data == null) return;
  console.log(data);

  return data;
}

/*
 * Searches the database for the provided word.
 *
 * @param {string} word - The word to search for.
 * @return {boolean}
 */
async function wordExists(word) {
  var sql = `SELECT COUNT(*) AS count FROM words WHERE word = ?`;
  const response = await query(sql, [word]);
  try {
    return response[0][0].count > 0;
  } catch (error) {
    // this should only error when there are no results
    console.error(error);
    return false;
  }
}

export { wordExists, getWordOfLength, getWordsByLengthRange };
