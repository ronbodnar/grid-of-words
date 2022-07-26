import { Game } from "../models/Game.class.js";
import query from "../services/database.service.js";
import { getAttemptsForGameId as getAttemptsByGameId } from "./attempt.repository.js";

/*
 * Inserts a new game into the database with the specified id and word.
 *
 * @param {string} id - The unique identifier for the game.
 * @param {string} word - The word to be guessed.
 * @return {Game | null} - The new game object or null if the game could not be created.
 */
export const insertGame = async (id, word, maxAttempts) => {
  try {
    const sql = `INSERT INTO games (id, word, max_attempts) VALUES(UUID_TO_BIN(?), ?, ?)`;
    const response = await query(sql, [id, word, maxAttempts]);
    return response !== null ? await getGameById(id) : null;
  } catch (err) {
    console.error("Error executing query:");
    console.error(err);
  }
};

/*
 * Updates the game record within the database.
 *
 * @param {Game} game - The game to update.
 * @param {boolean} updateEndTime - Whether or not to set the endTime in the query.
 */
export const saveGame = async (game, updateEndTime = false) => {
  try {
    var sql = `UPDATE games SET state = ?`;
    if (updateEndTime) sql += `, endTime = ?`;
    sql += ` WHERE id = UUID_TO_BIN(?)`;

    var values = updateEndTime
      ? [game.state, game.endTime, game.id]
      : [game.state, game.id];
    await query(sql, values);
  } catch (err) {
    console.error("Error executing query:");
    console.error(err);
  }
};

/*
 * Retrieves a game from the database by its id.
 *
 * @param {string} id - The unique identifier for the game.
 * @return {Game | null} - The game object or null if the game could not be found.
 */
export const getGameById = async (id, includeAttempts = true) => {
  try {
    const sql = `SELECT *, BIN_TO_UUID(id) AS id FROM games WHERE id = UUID_TO_BIN(?)`;
    const response = await query(sql, [id]);
    var game = new Game().fromJson(response[0][0]);
    if (game === null) return null;
    if (includeAttempts) {
      var attempts = await getAttemptsByGameId(game.id);
      if (attempts != null)
        game.attempts = attempts.map((attempt) => attempt.attempted_word);
    }
    return game;
  } catch (error) {
    // can be ignored, because it'll only fail if no result and no attempts are found (maybe)
    console.error(error);
    return null;
  }
};
