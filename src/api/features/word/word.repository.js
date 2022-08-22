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
const getWordOfLength = async (length) => {
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
    const wordCollection = database.getWordCollection();
    const result = await wordCollection.aggregate(pipeline).toArray();

    if (!result || !result[0].text) {
      return new DatabaseError(`No words found for length ${length}`);
    }

    return result[0].text;
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
const getWordsByLengthRange = async (length, sampleSize) => {
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
        $group: {
          _id: null,
          words: {
            $push: "$text",
          },
        },
      },
      {
        $replaceRoot: {
          newRoot: "$words",
        },
      },
    ];

    if (sampleSize && typeof sampleSize === "number") {
      pipeline.push({
        $sample: {
          size: sampleSize,
        },
      });
    }

    // TODO: need to add pagination here because this gets too many documents.
    const wordCollection = database.getWordCollection();
    const result = await wordCollection.aggregate(pipeline).toArray();

    console.log(result);

    if (!result || !(result.length > 0)) {
      return new DatabaseError(
        `No words found for word list of length ${length}`
      );
    }
    return result;
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
const wordExists = async (word) => {
  try {
    const wordCollection = database.getWordCollection();
    const result = await wordCollection.findOne({ text: word });
    return result && result.text;
  } catch (error) {
    return new NotFoundError(
      `An error occurred while checking if "${word}" exists in the database`,
      {
        error: error,
      }
    );
  }
};

export default {
  getWordOfLength,
  getWordsByLengthRange,
  wordExists,
};
