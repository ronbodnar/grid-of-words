import logger from "../config/winston.config.js";
import { convertToSnakeCase } from "../helpers.js";
import { User } from "../models/User.class.js";
import query from "../services/database.service.js";

/**
 * Finds a user by the specified property name and value.
 * 
 * @param {*} name The name of the property to search for.
 * @param {*} value The value of the property to match.
 * @returns {Promise<User | null>} Returns a promise that resolves to the user if found, otherwise null.
 */
export const findBy = async (name, value) => {
  // Validate the name and value of the property were passed.
  if (!name || !value) {
    logger.error("Invalid property name or value passed to User findBy", {
      prop: name,
      value: value,
    })
    return null;
  }

  // Convert the property name to snake_case for database compatibility.
  name = convertToSnakeCase(name);

  // Set up the dynamic parameter for the ID field to convert to binary.
  const dynamicParam = name === "id" ? "UUID_TO_BIN(?)" : "?";

  // Wait for the prepared query response from the database.
  const response = await query(
    "SELECT email, username, hash, creation_date AS creationDate, enabled, BIN_TO_UUID(id) AS id, " +
    "password_reset_token AS passwordResetToken, password_reset_token_expiration AS passwordResetTokenExpiration " +
      `FROM users WHERE ${name} = ${dynamicParam}`,
    [value]
  );

  if (!response) {
    return null;
  }

  // Create a new User object from the response and return it.
  const user = new User().fromJSON(response[0][0]);
  return user;
}

/**
 * Saves the passed User object to the database. If properties are declared, only those property names will be saved.
 * 
 * @param {User} user The user object to save to the database.
 * @param {Array} properties An Array of property names to save.
 * @returns {Promise<User | null>} The passed User object if successful, otherwise null.
 */
export const saveUser = async (user, properties) => {
  if (!user) {
    logger.error("Trying to saveUser on null or undefined user object", {
      user: user,
      properties: properties,
    });
  }

  // An array of specific property names to save.
  properties = properties || [];

  // A 2d array of properties and values from the User object.
  const userProps = Object.entries(user);

  // The start of the SQL query is the same regardless of update method.
  let sql = "UPDATE users SET ";
  let values = [];

  // Iterate all properties in the User object.
  for (let i = 0; i < userProps.length; i++) {
    const key = userProps[i][0];
    const value = userProps[i][1];

    // The user id and creation date never change.
    if (key === 'id' || key === 'creationDate') {
      continue;
    }

    // If we supplied property names, skip keys that are not included.
    if (properties.length > 0 && !properties.includes(key)) {
      continue;
    }

    const snakeCaseKey = convertToSnakeCase(key);

    sql += `${snakeCaseKey} = ?, `;
    values.push(value);
  }

  // Remove the trailing comma and space from the SQL query.
  sql = sql.slice(0, -2);

  // Finish off the query by converting the UUID to binary.
  sql += " WHERE id = UUID_TO_BIN(?)";
  values.push(user.id); // add the ID here for UUID_TO_BIN
  
  const response = await query(sql, values);

  // Check to see if the query was successful and respond with the User object.
  if (response && response[0]?.affectedRows && response[0]?.affectedRows > 0) {
    return user;
  }

  // Otherwise we failed to save any user.
  return null;
};

/**
 * Creates a new user in the database with the user's email, username, and password hash.
 * 
 * @param {User} user The User object to insert into the database.
 * @returns {Promise<User | null>} The passed User object or null if the user could not be inserted.
 */
export const insertUser = async (user) => {
  if (!user) return null;
  const response = await query(
    "INSERT INTO users (email, username, hash) VALUES (?, ?, ?)",
    [user.email, user.username, user.hash]
  );
  if (response && response[0]?.affectedRows && response[0]?.affectedRows > 0) {
    return user;
  }
  return null;
};
