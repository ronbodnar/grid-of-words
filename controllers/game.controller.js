import * as database from "../services/database.service.js";
import { getRandomWord } from "./word.controller.js";

async function getNewGame(req, res) {
  if (req.query.wordLength && (3 < req.query.wordLength < 7)) {
    var word = await getRandomWord(null, null);
    console.log('the random word is... ', word);
    return res.json(JSON.stringify({
      gameId: Math.random(),
      word: word,
      attempts: []
    }))
  }
  return res.end('holy');
}

export { getNewGame };
