import { ObjectId } from "mongodb";
import logger from "../../config/winston.config.js";
import database from "../../shared/database.js";
import { User } from "./index.js";

/**
 * Finds a {@link User} by the specified property name and value.
 *
 * @param {string} name The name of the property to search for.
 * @param {any} value The value of the property to match.
 * @returns {Promise<User | null>} A promise that resolves to the User if successful.
 */
const findBy = async (name, value) => {
  // Validate the name and value of the property were passed.
  if (!name || !value) {
    logger.error("Invalid property name or value passed to User findBy", {
      prop: name,
      value: value,
    });
    return null;
  }

  if (name === "_id" && typeof value === "string") {
    value = new ObjectId(value);
  }

  const result = await database.getUserCollection().findOne({
    [name]: value,
  });

  if (!result) {
    logger.error("User not found by property", {
      prop: name,
      value: value,
    });
    return null;
  }
  return new User().fromJSON(result);
};

/**
 * Saves the passed {@link User} to the database.
 *
 * @param {User} user The user object to save to the database.
 * @returns {Promise<User | null>} A promise that resolves to the User if successful.
 */
const saveUser = async (user) => {
  if (!user) {
    logger.error("Missing user object passed to saveUser", {
      user: user,
    });
  }

  const filter = {
    _id: user._id,
  };
  const update = {
    $set: user,
  };
  const result = await database.getUserCollection().updateOne(filter, update);
  if (result && result.acknowledged && result.modifiedCount > 0) {
    return user;
  } else {
    logger.error("Failed to update User record in database", {
      user: user,
      filter: filter,
      update: update,
      result: result,
    });
    return null;
  }
};

/**
 * Creates a new {@link User} in the database with the passed in user details.
 *
 * @param {User} user The User object to insert into the database.
 * @returns {Promise<InsertOneResult | null>} A promise that resolves to the insertion result if successful.
 */
const insertUser = async (user) => {
  if (!user) return null;
  try {
    const result = await database.getCollection("users").insertOne(user);
    if (!result.acknowledged) {
      logger.error(
        "Failed to insert new user into database: result not acknowledged",
        {
          user: user,
          result: result,
        }
      );
      return null;
    }
    return result;
  } catch (error) {
    logger.error("Failed to insert new user into the database.", {
      user: user,
      error: error,
    });
    return null;
  }
};

const findAll = async (req, res, next) => {
  const users = await database.getUserCollection().find().toArray();
  res.json(users);
};

export default {
  findBy,
  saveUser,
  insertUser,
  findAll,
};
