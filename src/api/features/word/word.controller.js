import InternalError from "../../errors/InternalError.js"
import {
  DEFAULT_LANGUAGE,
  DEFAULT_WORD_LENGTH,
} from "../../shared/constants.js"
import { getWord, getWordList } from "./word.service.js"

/**
 * Handles the selection of a random word.
 *
 * Endpoint: GET /word
 *
 * @async
 */
export const handleGetWord = async (req, res, next) => {
  const length = req.query.wordLength || DEFAULT_WORD_LENGTH
  const language = req.query.language || DEFAULT_LANGUAGE

  const randomWord = await getWord(length, language)
  if (randomWord instanceof Error) {
    return next(randomWord)
  }

  return res.json(randomWord)
}

/**
 * Handles retrieval of word lists.
 *
 * Endpoint: GET /word/list
 *
 * @async
 */
export const handleGetWordList = async (req, res, next) => {
  try {
    const length = parseInt(req.query.length) || DEFAULT_WORD_LENGTH
    const language = req.query.language || DEFAULT_LANGUAGE
    const wordList = await getWordList(length, language)
    if (wordList instanceof Error) {
      return next(wordList)
    }
    return res.json(wordList)
  } catch (error) {
    throw new InternalError("Failed to fetch word list", {
      error: error,
    })
  }
}
