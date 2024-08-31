import Game from "./Game.js";
import database from "../../shared/database.js";
import DatabaseError from "../../errors/DatabaseError.js";
import { ObjectId } from "mongodb";

/**
 * Inserts a new game into the database with the specified id and word.
 *
 * @async
 * @param {object} gameDoc - The game document to insert into the database.
 * @returns {Promise<Game|null>} A promise that resolves with the inserted Game ID if successful.
 */
export const insertGame = async (gameDoc) => {
  const cursor = await database.getGameCollection().insertOne(gameDoc);
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
 * @async
 * @param {Game} game - The Game object to save to the database.
 * @returns {Promise<DatabaseError|boolean>} A promise that resolves truthy if successful.
 */
export const updateGame = async (game) => {
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
 * @async
 * @param {string} gameId - The unique identifier for the game.
 * @returns {Promise<Game|null>} - The game object or null if the game could not be found.
 */
export const findGameById = async (gameId) => {
  if (!(gameId instanceof ObjectId)) {
    gameId = ObjectId.createFromHexString(gameId);
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
