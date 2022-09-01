import { Collection, MongoClient, ServerApiVersion } from "mongodb";
import DatabaseError from "../errors/DatabaseError.js";
import InternalError from "../errors/InternalError.js";

let client;

/**
 * Asynchronously connects to the MongoDB server.
 * 
 * @async
 */
const connect = async () => {
  try {
    client = new MongoClient(process.env.MONGO_URI, {
      tlsCertificateKeyFile: process.env.MONGO_CERT_PATH,
      serverApi: ServerApiVersion.v1,
    });
    await client.connect();
  } catch (error) {
    throw new DatabaseError("Couldn't connect to to MongoDB server", {
      connectionUrl: process.env.MONGO_URI,
      error: error,
    });
  }
};

/**
 * Obtains a collection with the specified name and database (or MONGO_DB_NAME if no db is specified).
 * 
 * @param {string} name The name of the collection
 * @param {string} database The name of the database storing the collection.
 * @returns {Collection} The MongoDB collection.
 */
const getCollection = (name, database = process.env.MONGO_DB_NAME) => {
  if (!name) {
    throw new InternalError("Collection name must be provided.");
  }
  if (!client) {
    throw new DatabaseError("Mongo client could not be found.");
  }

  const db = client.db(database);
  if (!db) {
    throw new DatabaseError("Database could not be found.", {
      client: client,
      database: database,
    });
  }
  return db.collection(name);
};

/**
 * Gets the MongoDB "games" collection.
 */
const getGameCollection = () => getCollection("games");

/**
 * Gets the MongoDB "words_enUS" collection.
 */
const getWordCollection = () => getCollection("words_enUS");

/**
 * Gets the MongoDB "users" collection.
 */
const getUserCollection = () => getCollection("users");

export default {
  connect,
  getCollection,
  getGameCollection,
  getWordCollection,
  getUserCollection,
};
