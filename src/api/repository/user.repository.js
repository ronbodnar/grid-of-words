import query from "../services/database.service.js";

export const findById = async (id) => {
  if (!id) return null;
  const response = await query(
    "SELECT email, username, hash, creation_date AS creationDate, enabled, BIN_TO_UUID(id) AS id " +
      "FROM users WHERE id = ?",
    [id]
  );
  return response[0][0];
};

export const findByEmail = async (email) => {
  if (!email) return null;
  const response = await query(
    "SELECT email, username, hash, creation_date AS creationDate, enabled, BIN_TO_UUID(id) AS id " +
      "FROM users WHERE email = ?",
    [email]
  );
  return response[0][0];
};

export const save = async (user) => {
  if (!user) return null;
  console.log("Saving user with salt", user.salt);
  console.log("Saving user with hash", user.hash);

  const response = await query(
    "INSERT INTO users (email, username, hash) VALUES (?, ?, ?)",
    [user.email, user.username, user.salt + user.hash]
  );
  if (response[0]?.affectedRows && response[0]?.affectedRows > 0) {
    return user;
  }
  return undefined;
};
