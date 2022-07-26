import query from "../services/database.service.js";

/*
 * Selects a random word with the specified length from the database.
 *
 * @param {number} length - The length of the word to be found.
 * @return {Word} word - An instance of the Word.
 */
export const getWordOfLength = async (length) => {
  try {
    var sql = `SELECT * FROM words WHERE CHAR_LENGTH(word) = ? ORDER BY RAND() LIMIT 1`;
    const data = await query(sql, [length]);
    if (data == null) return null;
    return data[0][0].word;
  } catch (err) {
    console.error(err);
  }
};

/*
 * Retrieves all words with a length within the specified min and max length range.
 *
 * @param {number} minLength - The minimum length of word to retrieve.
 * @param {number} maxLength - The maximum length of word to retrieve.
 * @return {Array} The list of words matching the length range.
 */
export const getWordsByLengthRange = async (minLength, maxLength) => {
  try {
    var sql = `SELECT word, LENGTH(word) AS length FROM words HAVING length >= ? AND length <= ?`;
    const data = await query(sql, [minLength, maxLength]);
    if (data == null) return;
    console.log(data);

    return data[0];
  } catch (err) {
    console.error(err);
  }
};

/*
 * Searches the database for the provided word.
 *
 * @param {string} word - The word to search for.
 * @return {boolean}
 */
export const wordExists = async (word) => {
  try {
    var sql = `SELECT COUNT(*) AS count FROM words WHERE word = ?`;
    const response = await query(sql, [word]);
    return response[0][0].count > 0;
  } catch (error) {
    // this should only error when there are no results
    console.error(error);
    return false;
  }
};
