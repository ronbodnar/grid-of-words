import { Game } from "./index.js";
import database from "../../shared/database.js";
import { DatabaseError } from "../../errors/DatabaseError.js";
import { ObjectId } from "mongodb";

// Thought about an upsert instead of separate functions, but I couldn't think of a reliable way to get the ID of the game.
// It seems like using the _id as a filter is causing issues by setting a default value.
// Anybody have any ideas?

/**
 * Inserts a new game into the database with the specified id and word.
 *
 * @param {object} gameDoc - The game document to insert into the database.
 * @return {Promise<Game | null>} A promise that resolves with the inserted Game ID if successful.
 */
const insertGame = async (gameDoc) => {
  const cursor = await database.getGameCollection().insertOne(gameDoc)
  if (!cursor || !cursor.insertedId) {
    return new DatabaseError("Failed to insert Game in database", {
      document: gameDoc,
    });
  }
  return cursor.insertedId;
};

/**
 * Updates the game record within the database.
 *
 * @param {Game} game - The Game object to save to the database.
 * @returns {Promise<DatabaseError | boolean>} A promise that resolves truthy if successful.
 */
const updateGame = async (game) => {
  const filter = {
    _id: game._id,
  };
  const update = {
    $set: game,
  };
  const cursor = await database.getGameCollection().updateOne(filter, update);
  if (!cursor || !cursor.acknowledged || !(cursor.modifiedCount === 1)) {
    return new DatabaseError("Failed to update Game record in database", {
      cursor: cursor,
      game: game,
    });
  }
  return true;
};

/**
 * Retrieves a game from the database by its id.
 *
 * @param {string} gameId - The unique identifier for the game.
 * @return {Promise<Game | null>} - The game object or null if the game could not be found.
 */
const findById = async (gameId) => {
  // Validate and convert the gameId here to avoid repeated code in the service layer.
  if (typeof gameId === "string") {
    gameId = new ObjectId(gameId);
  }

  const cursor = await database.getGameCollection().findOne({
    _id: gameId,
  });
  if (!cursor) {
    return null;
  }

  var game = new Game(cursor);
  return game;
};

export default {
  insertGame,
  updateGame,
  findById,
}