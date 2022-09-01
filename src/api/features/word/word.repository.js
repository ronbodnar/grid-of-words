import DatabaseError from "../../errors/DatabaseError.js"
import InternalError from "../../errors/InternalError.js"
import NotFoundError from "../../errors/NotFoundError.js"
import { DEFAULT_LANGUAGE } from "../../shared/constants.js"
import database from "../../shared/database.js"

/**
 * Selects a random word with the specified length from the database.
 *
 * @async
 * @param {number} length - The length of the word to be found.
 * @returns {Promise<string|InternalError|DatabaseError>} A promise that resolves to a random word of the specified length if successful.
 */
export const findWordByLength = async (length, language = DEFAULT_LANGUAGE) => {
  if (!length) {
    throw new InternalError("Word length is required")
  }
  try {
    length = Number(length)

    const pipeline = [
      {
        // Send the text field and the length of the text to the next stage.
        $project: {
          text: 1,
          length: {
            $strLenCP: "$text",
          },
        },
      },
      {
        // Only select words that match the specified length and are composed of only alphabetic characters.
        $match: {
          $and: [
            {
              length: length,
              text: {
                $regex:
                  language === "english"
                    ? /^[a-zA-Z]+$/
                    : /^[a-zA-ZáéíóúñÁÉÍÓÚÑ]+$/,
              },
            },
          ],
        },
      },
      {
        // Send only the text to the next stage.
        $project: {
          _id: 0,
          text: 1,
        },
      },
      {
        // Select one random word from the previous stage.
        $sample: {
          size: 1,
        },
      },
    ]
    const cursor = await database
      .getWordCollection(language)
      .aggregate(pipeline)
    if (!(await cursor.hasNext())) {
      return new DatabaseError(
        `No ${language} words found for length ${length}`
      )
    }

    const cursorResult = await cursor.next()
    if (!cursorResult) {
      return new NotFoundError(
        `Invalid randomWord of length ${length} from cursor`,
        {
          cursor: cursor,
        }
      )
    }
    return cursorResult.text.toLowerCase()
  } catch (error) {
    return new DatabaseError(
      `Failed to retrieve random word of length ${length}`,
      {
        error: error,
      }
    )
  }
}

/**
 * Retrieves all words with the specified `length`.
 *
 * @async
 * @param {number} length - The length of words to retrieve.
 * @returns {Promise<Array>} An Array of words matching the length.
 */
export const findAllWordsByLength = async (
  length,
  language = DEFAULT_LANGUAGE
) => {
  if (!length) {
    throw new InternalError("Required parameters: length")
  }
  try {
    length = Number(length)

    const pipeline = [
      {
        // Send the text field and the length of the text to the next stage.
        $project: {
          text: 1,
          length: {
            $strLenCP: "$text",
          },
        },
      },
      {
        // Only select words that match the specified length and are composed of only alphabetic characters.
        $match: {
          $and: [
            {
              length: length,
              text: {
                $regex:
                  language === "english"
                    ? /^[a-zA-Z]+$/
                    : /^[a-zA-ZáéíóúñÁÉÍÓÚÑ]+$/,
              },
            },
          ],
        },
      },
      {
        // Sort the words in ascending order by their text.
        $sort: {
          text: 1,
          _id: 1,
        },
      },
      {
        // Group all of the text (words) found with the given length into a words array for the next stage.
        $group: {
          _id: null,
          words: {
            $push: "$text",
          },
        },
      },
      {
        // Remove the object wrapper from the previous stage and output only the array of words.
        $replaceRoot: {
          newRoot: {
            words: "$words",
          },
        },
      },
    ]

    const cursor = await database
      .getWordCollection(language)
      .aggregate(pipeline)
    if (!(await cursor.hasNext())) {
      return new NotFoundError(`No words of length ${length} were found`)
    }

    const cursorResult = await cursor.next()
    if (!cursorResult) {
      return new DatabaseError("Invalid cursorResult", {
        cursorResult: cursorResult,
      })
    }
    return cursorResult.words
  } catch (error) {
    return new DatabaseError(`Failed to obtain word list of length ${length}`, {
      error: error,
    })
  }
}

/**
 * Searches the database for the provided word and returns the result.
 *
 * @async
 * @param {string} word - The word to search for.
 * @returns {Promise<boolean>} A promise that resolves to true if the search was successful or false otherwise.
 */
export const exists = async (word, language = DEFAULT_LANGUAGE) => {
  if (!word) {
    throw new InternalError("Required parameters: language, word")
  }
  try {
    const wordCollection = database.getWordCollection(language)
    const result = await wordCollection.findOne({ text: word.toLowerCase() })
    return result && result.text
  } catch (error) {
    return new DatabaseError(
      `An error occurred while checking if "${word}" exists in the database`,
      {
        error: error,
      }
    )
  }
}
