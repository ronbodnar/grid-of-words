import { Collection, MongoClient } from "mongodb"
import DatabaseError from "../errors/DatabaseError.js"
import InternalError from "../errors/InternalError.js"
import { DEFAULT_LANGUAGE } from "./constants.js"
import logger from "../config/winston.config.js"

let client

/**
 * Asynchronously connects to the MongoDB container.
 *
 * @async
 */
const connect = async (uri = process.env.MONGO_URI_LOCAL_CONTAINER) => {
  const {
    MONGO_URI_LOCAL_CONTAINER,
    MONGO_URI_REMOTE_CONTAINER,
    MONGO_REMOTE_HOST_ADDRESS,
  } = process.env

  try {
    client = new MongoClient(uri)
    await client.connect()
  } catch (error) {
    // The first failure re-runs the connect function with the remote mongo URI. If that fails, app will not start.
    if (uri === MONGO_URI_REMOTE_CONTAINER) {
      throw new DatabaseError("Couldn't connect to the remote mongo host", {
        remoteHostAddress: MONGO_REMOTE_HOST_ADDRESS,
        connectionUrl: MONGO_URI_REMOTE_CONTAINER,
        error: error,
      })
    } else {
      logger.error("Couldn't connect to the local mongo container.", {
        connectionUrl: MONGO_URI_LOCAL_CONTAINER,
        error: error,
      })
      logger.info(
        `Attempting to connect to remote mongo host: ${MONGO_REMOTE_HOST_ADDRESS}`
      )
      await connect(MONGO_URI_REMOTE_CONTAINER)
    }
  }
}

/**
 * Obtains a collection with the specified name and database (or MONGO_DB_NAME if no db is specified).
 *
 * @param {string} name The name of the collection
 * @param {string} database The name of the database storing the collection.
 * @returns {Collection} The MongoDB collection.
 */
const getCollection = (name, database = process.env.MONGO_DB_NAME) => {
  if (!name) {
    throw new InternalError("Collection name must be provided.")
  }
  if (!client) {
    throw new DatabaseError("Mongo client could not be found.")
  }

  const db = client.db(database)
  if (!db) {
    throw new DatabaseError("Database could not be found.", {
      client: client,
      database: database,
    })
  }
  return db.collection(name)
}

/**
 * Gets the MongoDB "games" collection.
 * @return {Promise<Collection>}
 */
const getGameCollection = () => getCollection("games")

/**
 * Gets the MongoDB word collection for the specified `language`.
 * @return {Promise<Collection>}
 */
const getWordCollection = (language = DEFAULT_LANGUAGE) =>
  getCollection(`words_${language}`)

/**
 * Gets the MongoDB "users" collection.
 * @return {Promise<Collection>}
 */
const getUserCollection = () => getCollection("users")

export default {
  connect,
  getCollection,
  getGameCollection,
  getWordCollection,
  getUserCollection,
}
