import { MongoClient, ServerApiVersion } from "mongodb";
import { InternalError } from "../errors/InternalError.js";
import logger from "../config/winston.config.js";

let client;

// Asynchronously connect to the database
const connect = async () => {
  try {
    client = new MongoClient(process.env.MONGO_URL, {
      tlsCertificateKeyFile: process.env.MONGO_CERT_PATH,
      serverApi: ServerApiVersion.v1,
    });
    await client.connect();
  } catch (error) {
    logger.error("Error connecting to MongoDB server", {
      connectionUrl: process.env.MONGO_URL,
      error: error,
    });
    throw new InternalError("Failed to connect to database server");
  }
};

/**
 * Obtains a collection with the specified name and database (or default db if no db is specified).
 * @param {*} name The name of the collection
 * @param {*} database The name of the database storing the collection.
 * @returns
 */
const getCollection = (name, database = process.env.MONGO_DB_NAME) => {
    if (!name) {
    throw new ValidationError("Collection name must be provided.");
  }
  if (!client) {
    throw new InternalError("Mongo client could not be found.");
  }

  const db = client.db(database);
  if (!db) {
    logger.error("Database could not be found", {
      client: client,
      database: database,
    });
    throw new InternalError("Database could not be found.");
  }
  return db.collection(name);
};

const getGameCollection = () => getCollection("games");
const getWordCollection = () => getCollection("words");
const getUserCollection = () => getCollection("users");

export default {
  connect,
  getCollection,
  getGameCollection,
  getWordCollection,
  getUserCollection
};