import { getRandomWord } from "./word.repository.js";
import { v4 as uuidv4 } from "uuid";

/*
 * Generate a new game and get a random word with the provided length.
 * @param {number} wordLength - The length of the word to be found.
 * @return {Game} - The new game object
 */
async function generate(wordLength) {
  const uuid = uuidv4();
  var word = await getRandomWord(wordLength);
  console.log("word: ", word.uuid);
  const sql = `INSERT INTO games(word) VALUES(${word})`;
  return {
    gameId: uuid,
    word: word,
  };
}

function attempt(req, res) {}

function get(req, res) {}

export { get, generate, attempt };
