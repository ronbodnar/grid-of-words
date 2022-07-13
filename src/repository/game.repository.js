import { Game } from "../models/Game.class.js";
import * as database from "../services/database.service.js";

/*
 * Inserts a new game into the database with the specified id and word.
 *
 * @param {string} id - The unique identifier for the game.
 * @param {string} word - The word to be guessed.
 * @return {Game | null} - The new game object or null if the game could not be created.
 */
async function create(id, word) {
  const sql = `INSERT INTO games (id, word) VALUES(UUID_TO_BIN(?), ?)`;
  const response = await database.query(sql, [id, word]);
  return response !== null ? get(id) : null;
}

/*
 * Inserts a new attempt into the game_attempts table.
 *
 * @param {string} id - The id of the game to make an attempt on.
 * @param {string} word - The word that the user guessed.
 */
async function addAttempt(id, word) {
  const sql = `INSERT INTO game_attempts (game_id, attempted_word) VALUES (UUID_TO_BIN(?), ?)`;
  const response = await database.query(sql, [id, word]);
  if (response == null || response.affectedRows === 0) return false;
  return true;
}

async function getAttempts(id) {
  const sql = `SELECT *, BIN_TO_UUID(game_id) AS game_id FROM game_attempts WHERE game_id = UUID_TO_BIN(?)`;
  const response = await database.query(sql, [id]);
  return response[0];
}

/*
 * Retrieves a game from the database by its id.
 *
 * @param {string} id - The unique identifier for the game.
 * @return {Game | null} - The game object or null if the game could not be found.
 */
async function get(id, includeAttempts = true) {
  const sql = `SELECT *, BIN_TO_UUID(id) AS id FROM games WHERE id = UUID_TO_BIN(?)`;
  const response = await database.query(sql, [id]);
  try {
    var game = new Game().fromJson(response[0][0]);
    if (includeAttempts) {
      var attempts = await getAttempts(game.uuid);
      if (attempts != null)
        game.attempts = attempts.map((attempt) => attempt.attempted_word);
    }
    return game;
  } catch (error) {
    // can be ignored, because it'll only fail if no result is found (maybe)
    console.error(error);
    return null;
  }
}

export { get, create, addAttempt, getAttempts };
