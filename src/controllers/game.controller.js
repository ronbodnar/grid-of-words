import * as gameRepository from "../repository/game.repository.js";

async function generate(req, res) {
  const length = req.query.wordLength;
  if (length == null || !(3 < length < 7)) {
    return res.end();
  }
  const gameData = await gameRepository.generate(length);
  return res.json(gameData);
}

function get(req, res) {
  return gameRepository.get(req, res);
}

function attempt(req, res) {
  return gameRepository.attempt(req, res);
}

export { get, generate, attempt };
