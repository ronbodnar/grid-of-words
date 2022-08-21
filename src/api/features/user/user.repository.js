import { ObjectId } from "mongodb";
import logger from "../../config/winston.config.js";
import database from "../../shared/database.js";
import { User } from "./User.js";

/**
 * Finds a user by the specified property name and value.
 *
 * @param {*} name The name of the property to search for.
 * @param {*} value The value of the property to match.
 * @returns {Promise<User | null>} A promise that resolves to the User if successful.
 */
export const findBy = async (name, value) => {
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

  const usersCollection = database.getUserCollection();

  const result = await usersCollection.findOne({
    [name]: value
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
 * Saves the passed User object to the database.
 *
 * @param {User} user The user object to save to the database.
 * @returns {Promise<User | null>} A promise that resolves to the User if successful.
 */
export const saveUser = async (user) => {
  if (!user) {
    logger.error("Missing user object passed to saveUser", {
      user: user,
    });
  }

  const usersCollection = database.getUserCollection();
  const filter = {
    _id: user._id,
  };
  const update = {
    $set: user
  }
  const result = await usersCollection.updateOne(filter, update);
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
 * Creates a new user in the database with the user's email, username, and password hash.
 *
 * @param {User} user The User object to insert into the database.
 * @returns {Promise<any>} A promise that resolves to the insertion result if successful.
 */
export const insertUser = async (user) => {
  if (!user) return null;
  try {
    const usersCollection = database.getCollection("users");
    const result = await usersCollection.insertOne(user);
    if (!result.acknowledged) {
      logger.error("Failed to insert new user into database: result not acknowledged", {
        user: user,
        result: result,
      });
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

export const findAll = async (req, res, next) => {
  const response = database.getCollection("users");
  const users = await response.find().toArray();
  res.json(users);
};