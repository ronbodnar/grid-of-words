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
    MONGO_REMOTE_HOST_ADDRESS,
    MONGO_REMOTE_HOST_PORT,
    MONGO_DB_NAME,
    MONGO_INITDB_ROOT_USERNAME,
    MONGO_INITDB_ROOT_PASSWORD,
    MONGO_CONTAINER_NAME,
  } = process.env

  try {
    const MONGO_URI_LOCAL = `mongodb://${MONGO_INITDB_ROOT_USERNAME}:${MONGO_INITDB_ROOT_PASSWORD}@${MONGO_CONTAINER_NAME}/${MONGO_DB_NAME}?authSource=admin`
    const MONGO_URI_REMOTE = `mongodb://${MONGO_INITDB_ROOT_USERNAME}:${MONGO_INITDB_ROOT_PASSWORD}@${MONGO_REMOTE_HOST_ADDRESS}:${MONGO_REMOTE_HOST_PORT}/${MONGO_DB_NAME}?authSource=admin`

    const remoteClient = new MongoClient(MONGO_URI_REMOTE)
    const localClient = new MongoClient(MONGO_URI_LOCAL)

    // Try to connect to both the local and remote mongo containers and use the first connection that succeeds.
    client = await Promise.any([remoteClient.connect(), localClient.connect()])

    logger.info(
      `Successfully connected to Mongo instance at ${client.options.hosts.toString()}!`
    )
  } catch (error) {
    throw new DatabaseError("Couldn't connect to the remote mongo host", {
      remoteHostAddress: MONGO_REMOTE_HOST_ADDRESS,
      connectionUrl: MONGO_URI_REMOTE_CONTAINER,
      error: error,
    })
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
