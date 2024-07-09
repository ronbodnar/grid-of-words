/*
 * Word utility module for processing a new line separated word list
 */
import fs from "node:fs";
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
  logger.log('Word length', wordLength);
  const wordList = readAllWords(filePath);
  logger.log("Word list", wordList);
  return res.send('hey');//wordList.join("\n"));
}

/*
 * Reads all words from the specified file.
 * @param {string} path The file system path to the file being read.
 * @param {boolean} filter Whether to filter the word list.
 * @return {list} The list of words, either raw or filtered.
 */
function readAllWords(path, filter = true, encoding = "utf8") {
  fs.readFile(path, encoding, (err, data) => {
    if (err) {
      console.error(err);
      return;
    }
    const words = data.split("\n");
    return filter ? getFilteredWords(words) : words;
  });
}

/*
 * Filters the given word list to remove any words that contain non-lowercase letters.
 * @param {Array} words The array of words to be filtered.
 * @return {Array} The filtered array of words.
 */
function getFilteredWords(words, pattern = filterPattern) {
  var filteredWords = [];
  var invalidWords = [];

  try {
    var regex = new RegExp(pattern);
  } catch (e) {
    console.error(`Invalid pattern: ${pattern}`);
    return words;
  }

  filteredWords = words.filter((word) => {
    word = word.trim();
    var valid = true;
    if (regex.test(word)) {
      invalidWords.push(word);
      valid = false;
    }
    return valid;
  });

  logger.writeToFile("invalid-words.txt", invalidWords.join("\n"));
  logger.writeToFile("filtered-words.txt", filteredWords.join("\n"));

  logger.log(`${filteredWords.length} filtered words found`);

  return filteredWords;
}

export { getWord };