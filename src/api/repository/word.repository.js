import logger from "../config/winston.config.js";
import query from "../services/database.service.js";

/*
 * Selects a random word with the specified length from the database.
 *
 * @param {number} length - The length of the word to be found.
 * @return {Word} word - An instance of the Word.
 */
export const getWordOfLength = async (length) => {
  try {
    // Set up the SQL query string.
    var sql = `SELECT * FROM words WHERE CHAR_LENGTH(text) = ? ORDER BY RAND() LIMIT 1`;

    // Execute the query and retrieve the response.
    const data = await query(sql, [length]);

    console.log(data);

    // If the data is missing, return null.
    if (data == null || data[0][0] == null) return null;

    // Return only the word.
    return data[0][0].text;
  } catch (error) {
    logger.error("Unexpected error getting random word", {
      error: error,
      length: length
    });
    return null;
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
    // Set up the SQL query string.
    var sql = `SELECT text, LENGTH(text) AS length FROM words HAVING length >= ? AND length <= ?`;
    
    // Execute the query and retrieve the response.
    const data = await query(sql, [minLength, maxLength]);

    // If the data is missing, return null.
    if (!data || !data[0]) return null;

    // Return the list of words.
    return data[0];
  } catch (error) {
    logger.error("Could not retrieve word list from database", {
      error: error,
      min: minLength,
      max: maxLength
    });
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
    // Set up the SQL query string.
    var sql = `SELECT COUNT(*) AS count FROM words WHERE text = ?`;

    // Execute the query and retrieve the response.
    const response = await query(sql, [word]);

    // If the count is greater than 0, the word exists in the database.
    return response[0][0].count > 0;
  } catch (error) {
    // this should only error when there are no results
    logger.info("Error validating word existence", {
      error: error,
      word: word
    });
    return false;
  }
};
