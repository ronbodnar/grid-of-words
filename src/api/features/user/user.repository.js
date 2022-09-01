import logger from "../../config/winston.config.js";
import database from "../../shared/database.js";
import User from "./User.js";
import ValidationError from "../../errors/ValidationError.js";
import { ObjectId } from "mongodb";

/**
 * Finds a {@link User} by the specified property name and value.
 *
 * @async
 * @param {string} name The name of the property to search for.
 * @param {any} value The value of the property to match.
 * @returns {Promise<User|null>} A promise that resolves to the User if successful.
 */
export const findUserBy = async (name, value) => {
  if (!name || !value) {
    return new ValidationError(
      "Invalid property name or value passed to User findBy",
      {
        prop: name,
        value: value,
      }
    );
  }

  // Convert the _id field value to an ObjectId instance of the value.
  if (name === "_id" && !(value instanceof ObjectId)) {
    value = ObjectId.createFromHexString(value);
  }

  const result = await database.getUserCollection().findOne({
    [name]: value,
  });

  if (!result) {
    logger.warn("User not found by property", {
      prop: name,
      value: value,
      valueType: typeof value,
    });
    return null;
  }
  return new User(result);
};

/**
 * Saves the passed {@link User} to the database.
 *
 * @async
 * @param {User} user The user object to save to the database.
 * @returns {Promise<User|null>} A promise that resolves to the User if successful.
 */
export const updateUser = async (user, properties) => {
  if (!user) {
    return new ValidationError("Missing user object passed to saveUser", {
      user: user,
    });
  }

  if (!properties || typeof properties !== "object") {
    return new ValidationError(
      "Invalid properties object passed to updateUser",
      {
        properties: properties,
      }
    );
  }

  // Remove the _id key from the properties and ensure they are valid and defined in User.
  const filteredProperties = Object.entries(properties).filter(
    ([key, value]) => Object.hasOwn(user, key) && key !== "_id" && value != null
  );
  const undefinedProperties = Object.entries(properties).filter(
    ([key, value]) => value == null
  );

  const filter = {
    _id: user._id,
  };
  const update = {
    $set: Object.fromEntries(filteredProperties),
    $unset: Object.fromEntries(undefinedProperties),
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
 * @async
 * @param {User} user The User object to insert into the database.
 * @returns {Promise<InsertOneResult|null>} A promise that resolves to the insertion result if successful.
 */
export const insertUser = async (user) => {
  if (!user) {
    throw new ValidationError("Missing user object passed to insertUser", {
      user: user,
    });
  }
  try {
    const result = await database
      .getCollection("users")
      .insertOne(user.getWithoutUndefined());
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