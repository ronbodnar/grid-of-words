import logger from "../../config/winston.config.js";
import database from "../../shared/database.js";

/*
 * Selects a random word with the specified length from the database.
 *
 * @param {number} length - The length of the word to be found.
 * @return {Word} word - An instance of the Word.
 */
export const getWordOfLength = async (length) => {
  try {
    const filter = {
      text: {
        length: length,
      },
    };
    const wordCollection = database.getWordCollection();
    const result = await wordCollection.findOne(filter);

    console.log(`getWordOfLength(${length}) Result`, result);
  } catch (error) {
    logger.error("Unexpected error getting random word", {
      error: error,
      length: length,
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
    //^[A-Za-z]{${minLength},${maxLength}}$
    const wordCollection = database.getWordCollection();
    const result = await wordCollection
      .find({
        text: {
          $gte: minLength,
          $lte: maxLength,
        },
      })
      .toArray();
    console.log(
      `getWordsByLengthRange(${minLength}, ${maxLength}) Result`,
      result
    );
  } catch (error) {
    logger.error("Could not retrieve word list from database", {
      error: error,
      min: minLength,
      max: maxLength,
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
    const wordCollection = database.getWordCollection();
    const result = await wordCollection.findOne({ text: word });
    console.log("wordExists Result", result);
  } catch (error) {
    // this should only error when there are no results
    logger.info("Error validating word existence", {
      error: error,
      word: word,
    });
    return false;
  }
};
