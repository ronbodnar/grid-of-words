import { query } from "../services/database.service.js";
import { Word } from "../models/Word.class.js";
import * as database from "../services/database.service.js";

async function getRandomWord(length) {
  var sql = `SELECT BIN_TO_UUID(uuid) AS uuid, word FROM words WHERE CHAR_LENGTH(word) = ? ORDER BY RAND() LIMIT 1`;
  const data = await database.execute(sql, [length]);
  if (data == null) return null;
  const word = new Word(data[0][0].uuid, data[0][0].word);
  return word;
}

export { getRandomWord };
