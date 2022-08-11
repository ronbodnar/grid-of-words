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

export const saveUser = async (user) => {
  if (!user) return null;

  console.log("Saving User", user);

  const response = await query(
    "UPDATE users SET username = ?, hash = ? WHERE id = UUID_TO_BIN(?)",
    [user.username, user.getSalt() + user.getHash(), user.id]
  );
  if (!response) {
    return null;
  }

  console.log("Response", response);
  if (response[0]?.affectedRows && response[0]?.affectedRows > 0) {
    return user;
  }
  return null;
};

export const insertUser = async (user) => {
  if (!user) return null;
  console.log("Saving user with hash", user.hash);

  const response = await query(
    "INSERT INTO users (email, username, hash) VALUES (?, ?, ?)",
    [user.email, user.username, user.hash]
  );
  if (!response) {
    return null;
  }
  if (response[0]?.affectedRows && response[0]?.affectedRows > 0) {
    return user;
  }
  return null;
};