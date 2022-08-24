import {
  MAXIMUM_WORD_LENGTH,
  MINIMUM_WORD_LENGTH,
} from "../../shared/constants.js";
import InternalError from "../../errors/InternalError.js";
import ValidationError from "../../errors/ValidationError.js";
import { findByLength, findAllByLength } from "./word.repository.js";

export const getWord = async (length) => {
  if (!length) {
    return new InternalError("Missing required parameter: length");
  }
  if (!(MINIMUM_WORD_LENGTH <= length && length <= MAXIMUM_WORD_LENGTH)) {
    return new ValidationError("Word length is out of bounds");
  }
  const randomWord = findByLength(length);
  return randomWord;
};

export const getWordList = async (length) => {
  const validLength =
    MINIMUM_WORD_LENGTH <= length && length <= MAXIMUM_WORD_LENGTH;
  if (!validLength) {
    return new ValidationError("Word length is out of bounds");
  }
  const wordList = findAllByLength(length);
  return wordList;
};
