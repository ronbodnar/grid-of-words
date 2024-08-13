import logger from "../../config/winston.config.js";
import query from "../../services/database.service.js";

/*
 * Inserts a new attempt into the game_attempts table.
 *
 * @param {string} id - The id of the game to make an attempt on.
 * @param {string} word - The word that the user guessed.
 */
export const insertAttempt = async (id, word) => {
  // Set up the SQL query string.
  const sql = `INSERT INTO game_attempts (game_id, attempted_word) VALUES (UUID_TO_BIN(?), ?)`;

  // Execute the query and retrieve the response.
  const response = await query(sql, [id, word]);

  // If the insertion failed, log the error and return false.
  if (!response || response.affectedRows === 0) {
    logger.error("Could not insert attempt into game_attempts table", {
      id: id,
      word: word,
      response: response,
      sql: sql,
    });
    return false;
  }
  return true;
};

/*
 * Retrieves the attempts for a given game from the game_attempts table.
 *
 * @param {string} id - The id of the game to retrieve attempts for.
 */
export const getAttemptsForGameId = async (id) => {
  try {
    // Set up the SQL query string.
    const sql = `SELECT *, BIN_TO_UUID(game_id) AS game_id FROM game_attempts WHERE game_id = UUID_TO_BIN(?)`;

    // Execute the query and retrieve the response.
    const response = await query(sql, [id]);

    return response[0];
  } catch (err) {
    logger.error("Could not otain attempts for game", {
      id: id,
      error: err,
    });
  }
};
