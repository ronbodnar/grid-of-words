import query from "../services/database.service.js";

/*
 * Inserts a new attempt into the game_attempts table.
 *
 * @param {string} id - The id of the game to make an attempt on.
 * @param {string} word - The word that the user guessed.
 */
export const insertAttempt = async (id, word) => {
  const sql = `INSERT INTO game_attempts (game_id, attempted_word) VALUES (UUID_TO_BIN(?), ?)`;
  const response = await query(sql, [id, word]);
  if (response == null || response.affectedRows === 0) return false;
  return true;
};

/*
 * Retrieves the attempts for a given game from the game_attempts table.
 *
 * @param {string} id - The id of the game to retrieve attempts for.
 */
export const getAttemptsForGameId = async (id) => {
  try {
    const sql = `SELECT *, BIN_TO_UUID(game_id) AS game_id FROM game_attempts WHERE game_id = UUID_TO_BIN(?)`;
    const response = await query(sql, [id]);
    return response[0];
  } catch (err) {
    console.error("Error executing query:");
    console.error(err);
  }
};
