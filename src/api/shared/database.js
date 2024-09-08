import { Collection, MongoClient, ServerApiVersion } from "mongodb"
import DatabaseError from "../errors/DatabaseError.js"
import InternalError from "../errors/InternalError.js"
import { DEFAULT_LANGUAGE } from "./constants.js"

let client

/**
 * Asynchronously connects to the MongoDB container.
 *
 * @async
 */
const connect = async () => {
  try {
    const {
      MONGO_CERT_PATH,
      MONGO_INITDB_ROOT_USERNAME,
      MONGO_INITDB_ROOT_PASSWORD,
      MONGO_CONTAINER_SERVICE_NAME,
    } = process.env
    client = new MongoClient(
      `mongodb://${MONGO_INITDB_ROOT_USERNAME}:${MONGO_INITDB_ROOT_PASSWORD}@${MONGO_CONTAINER_SERVICE_NAME}`,
      {
        tlsCertificateKeyFile: MONGO_CERT_PATH,
        serverApi: ServerApiVersion.v1,
      }
    )
    await client.connect()
  } catch (error) {
    throw new DatabaseError("Couldn't connect to to MongoDB server", {
      connectionUrl: process.env.MONGO_URI,
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
