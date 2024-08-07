import logger from "../config/winston.config.js";
import { Game } from "../models/Game.class.js";
import query from "../services/database.service.js";
import { getAttemptsForGameId as getAttemptsByGameId } from "./attempt.repository.js";

/**
 * Inserts a new game into the database with the specified id and word.
 *
 * @param {string} id - The unique identifier for the game.
 * @param {string} word - The word to be guessed.
 * @param {number} maxAttempts - The maximum number of attempts in the game.
 * @param {string | null} ownerId - The user id for the owner of the game.
 * @return {Promise<Game | null>} - The new game object or null if the game could not be created.
 */
export const insertGame = async (id, word, maxAttempts, ownerId) => {
  // Set up the SQL query string.
  const sql = `INSERT INTO games (id, word, max_attempts, owner_id) VALUES(UUID_TO_BIN(?), ?, ?, UUID_TO_BIN(?))`;

  // Execute the query and retrieve the response.
  const response = await query(sql, [id, word, maxAttempts, ownerId]);

  // If the response is null, log an error and return null.
  if (!response) {
    logger.error("Failed to create a new Game entry in database", {
      id: id,
      word: word,
      maxAttempts: maxAttempts,
      ownerId: ownerId,
    });
    return null;
  }

  // Return the inserted Game object synchronously.
  return await getGameById(id);
};

/**
 * Updates the game record within the database.
 *
 * @param {Game} game - The game to update.
 * @param {boolean} updateEndTime - Whether or not to set the endTime in the query.
 */
export const saveGame = async (game, updateEndTime = false) => {
  // Build the SQL query string with endTime if updateEndTime is set to true.
  var sql = `UPDATE games SET state = ?`;
  if (updateEndTime) sql += `, endTime = ?`;
  sql += ` WHERE id = UUID_TO_BIN(?)`;

  // Build the array of values to pass to the query, depending on updateEndTime state.
  var values = updateEndTime
    ? [game.state, game.endTime, game.id]
    : [game.state, game.id];

  // Execute the query and retrieve the response.
  const response = await query(sql, values);

  // If the response is null, log an error.
  if (!response) {
    logger.error("Failed to update Game record in database", {
      game: game,
      updateEndTime: updateEndTime,
      sql: sql,
    });
  }
  return response;
};

/**
 * Retrieves a game from the database by its id.
 *
 * @param {string} id - The unique identifier for the game.
 * @return {Promise<Game | null>} - The game object or null if the game could not be found.
 */
export const getGameById = async (id, includeAttempts = true) => {
  // Set up the SQL query string.
  const sql =
    `SELECT BIN_TO_UUID(id) AS id, BIN_TO_UUID(owner_id) AS ownerId, ` +
    `state, max_attempts AS maxAttempts, ` +
    `start_timestamp AS startTimestamp, end_timestamp AS endTimestamp ` +
    `FROM games WHERE id = UUID_TO_BIN(?)`;

  // Execute the query and retrieve the response.
  const response = await query(sql, [id]);
  if (!response) return null;

  // Construct a new Game from the JSON response
  var game = new Game().fromJson(response[0][0]);

  // If the game object is null, log an error and return null.
  if (!game) {
    logger.error("Could not create a Game from the JSON response", {
      game: game,
      response: response,
      gameData: response[0][0],
    });
    return null;
  }

  // Obtain the game's attempts if includeAttempts is truthy.
  if (includeAttempts) {
    // Synchronously retrieve the attempts for the specified game id.
    var attempts = await getAttemptsByGameId(game.id);

    // If attempts are found, iterate over attempts and map the attempted word to the attempts array.
    if (attempts) {
      game.attempts = attempts.map((attempt) => attempt.attempted_word);
    }
  }

  return game;
};
