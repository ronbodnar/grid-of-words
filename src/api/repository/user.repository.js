import logger from "../config/winston.config.js";
import { convertToSnakeCase } from "../helpers.js";
import { User } from "../models/User.class.js";
import query from "../services/database.service.js";

export const findById = async (id) => {
  if (!id) return null;
  const response = await query(
    "SELECT email, username, hash, creation_date AS creationDate, enabled, BIN_TO_UUID(id) AS id " +
      "FROM users WHERE id = UUID_TO_BIN(?)",
    [id]
  );
  if (!response) {
    return null;
  }
  const user = new User().fromJSON(response[0][0]);
  return user;
};

export const findByEmail = async (email) => {
  if (!email) return null;
  const response = await query(
    "SELECT email, username, hash, creation_date AS creationDate, enabled, BIN_TO_UUID(id) AS id " +
      "FROM users WHERE email = ?",
    [email]
  );
  if (!response) {
    return null;
  }
  const user = new User().fromJSON(response[0][0]);
  return user;
};

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

    if (properties.length > 0 && !properties.includes(key)) {
      continue;
    }

    // The final property shouldn't end with a comma.
    const suffix = i === userProps.length - 1 ? " " : ", ";

    // Convert user id property to UUID_TO_BIN in query.
    const dynamicParam = key === "id" ? "UUID_TO_BIN(?)" : "?";

    const snakeCaseKey = convertToSnakeCase(key);

    sql += `${snakeCaseKey} = ${dynamicParam + suffix}`;
    values.push(value);
  }

  // Finish off the query by converting the UUID to binary.
  sql += "WHERE id = UUID_TO_BIN(?)";
  values.push(user.id); // add the ID here for UUID_TO_BIN
  
  const response = await query(sql, values);

  // Check to see if the query was successful and respond with the User object.
  if (response && response[0]?.affectedRows && response[0]?.affectedRows > 0) {
    return user;
  }

  // Otherwise we failed to save any user.
  return null;
};

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
