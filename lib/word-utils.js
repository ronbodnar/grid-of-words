/*
 * Word utility module for processing a new line separated word list
 */
import { promises as fs } from "node:fs";
import path from "node:path";

import * as logger from "../utils/logging.utils.js";

const __dirname = import.meta.dirname;

const filterPattern = new RegExp(/^[^a-z]/);
const filePath = path.join(__dirname, "..", "words.txt");

/*
 * Gets a random word from the word list, applying any filters necessary if applicable.
 */
 function getWord(req, res) {
  var wordLength = 5;
  if (req.query.length != null) {
    wordLength = req.query.length;
  }

  const wordList = readAllWords(filePath, wordLength);


  console.log('wordList: ', wordList.length);
  for (var i = 0; i < 50; i++) {
    console.log(wordList[i]);
  }
  return wordList[Math.floor(Math.random() * wordList.length)];
}

/*
 * Reads all words from the specified file.
 * @param {string} path The file system path to the file being read.
 * @param {boolean} filter Whether to filter the word list.
 * @return {list} The list of words, either raw or filtered.
 */
async function readAllWords(path, wordLength, encoding = "utf8") {
  const data = await fs.readFile(path, encoding);
  const words = data.split("\n");
  return getFilteredWords(words, wordLength);
}

/*
 * Filters the given word list to remove any words that contain non-lowercase letters.
 * @param {Array} words The array of words to be filtered.
 * @return {Array} The filtered array of words.
 */
function getFilteredWords(words, length, pattern = filterPattern) {
  var filteredWords = [];
  var invalidWords = [];

  try {
    var regex = new RegExp(pattern);
  } catch (e) {
    console.error(`Invalid pattern: ${pattern}`);
    return words;
  }

  console.log('getFilteredWords');
  console.log(words.length + ' words');
  for (var i = 0; i < 50; i++) {
    console.log(i, words[i]);
  }
  var i = 0;
  filteredWords = words.filter((word) => {
    word = word.trim();
    if (i++ <= 50) console.log(word);
    var valid = true;
    if (word.length != length || regex.test(word)) {
      invalidWords.push(word);
      valid = false;
    }
    return valid;
  });

  logger.log(`${filteredWords.length} filtered words found`);

  return filteredWords;
}

export { getWord };