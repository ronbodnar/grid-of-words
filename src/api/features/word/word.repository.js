import { DatabaseError } from "../../errors/DatabaseError.js";
import { InternalError } from "../../errors/InternalError.js";
import { NotFoundError } from "../../errors/NotFoundError.js";
import database from "../../shared/database.js";

/**
 * Selects a random word with the specified length from the database.
 *
 * @param {number} length - The length of the word to be found.
 * @returns {Promise<string | InternalError | DatabaseError>} A promise that resolves to a random word of the specified length if successful.
 */
const findByLength = async (length) => {
  if (!length) {
    throw new InternalError("Word length is required");
  }
  try {
    length = Number(length);

    const pipeline = [
      {
        $project: {
          text: 1,
          length: {
            $strLenCP: "$text",
          },
        },
      },
      {
        $match: {
          $and: [
            {
              length: length,
              text: {
                $regex: /^[a-zA-Z]+$/,
              },
            },
          ],
        },
      },
      {
        $project: {
          _id: 0,
          text: 1,
        },
      },
      {
        $sample: {
          size: 1,
        },
      },
    ];
    const cursor = await database.getWordCollection().aggregate(pipeline);
    if (!(await cursor.hasNext())) {
      return new DatabaseError(`No words found for length ${length}`);
    }

    const cursorResult = await cursor.next();
    if (!cursorResult) {
      return new NotFoundError(
        `Invalid randomWord of length ${length} from cursor`,
        {
          cursor: cursor,
        }
      );
    }
    return cursorResult.text;
  } catch (error) {
    return new DatabaseError(
      `Failed to retrieve random word of length ${length}`,
      {
        error: error,
      }
    );
  }
};

/*
 * Retrieves all words with a length within the specified min and max length range.
 *
 * @param {number} minLength - The minimum length of word to retrieve.
 * @param {number} maxLength - The maximum length of word to retrieve.
 * @return {Array} The list of words matching the length range.
 */
const findAllByLength = async (length) => {
  if (!length) {
    throw new InternalError("Missing required length parameter");
  }
  try {
    length = Number(length);

    const pipeline = [
      {
        $project: {
          text: 1,
          length: {
            $strLenCP: "$text",
          },
        },
      },
      {
        $match: {
          $and: [
            {
              length: length,
              text: {
                $regex: /^[a-zA-Z]+$/,
              },
            },
          ],
        },
      },
      {
        $sort: {
          text: 1,
          _id: 1,
        },
      },
      {
        $group: {
          _id: null,
          words: {
            $push: "$text",
          },
        },
      },
      {
        $replaceRoot: {
          newRoot: {
            words: "$words",
          },
        },
      },
    ];

    const cursor = await database.getWordCollection().aggregate(pipeline);
    if (!(await cursor.hasNext())) {
      return new NotFoundError(`No words of length ${length} were found`);
    }

    const cursorResult = await cursor.next();
    if (!cursorResult) {
      return new DatabaseError("Invalid cursorResult", {
        cursorResult: cursorResult,
      });
    }
    return cursorResult.words;
  } catch (error) {
    return new DatabaseError(`Failed to obtain word list of length ${length}`, {
      error: error,
    });
  }
};

/*
 * Searches the database for the provided word.
 *
 * @param {string} word - The word to search for.
 * @return {boolean}
 */
const exists = async (word) => {
  try {
    const wordCollection = database.getWordCollection();
    const result = await wordCollection.findOne({ text: word });
    return result && result.text;
  } catch (error) {
    return new DatabaseError(
      `An error occurred while checking if "${word}" exists in the database`,
      {
        error: error,
      }
    );
  }
};

export default {
  findByLength,
  findAllByLength,
  exists,
};
