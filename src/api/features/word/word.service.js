import { ValidationError } from "../../errors/ValidationError.js";
import {
  MAXIMUM_WORD_LENGTH,
  MINIMUM_WORD_LENGTH,
} from "../../shared/constants.js";
import { wordRepository } from "./index.js";

const getWord = async (length) => {
  if (!(MINIMUM_WORD_LENGTH <= length && length <= MAXIMUM_WORD_LENGTH)) {
    return new ValidationError("Word length is out of bounds");
  }

  // Synchronously retrieve the word from the database.
  const randomWord = wordRepository.getWordOfLength(length);

  return randomWord;
};

const getWordList = async (length) => {
  const validLength = MINIMUM_WORD_LENGTH <= length && length <= MAXIMUM_WORD_LENGTH;
  if (!validLength) {
    return new ValidationError("Word length is out of bounds");
  }

  const wordList = wordRepository.getWordsByLengthRange(length);

  return wordList;
};

export default {
  getWord,
  getWordList,
};
