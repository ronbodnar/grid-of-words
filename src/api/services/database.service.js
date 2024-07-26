import mysql from "mysql2/promise";
import { logger } from "../../index.js";

// Create a connection pool to the MySQL database
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

/*
 * Asynchronously query the database for results, uses prepared statements if values is defined.
 *
 * @param {string} sql - The SQL query to execute.
 * @param {List} values - A list of values to inject into the query string.
 * @return {Promise}
 */
const query = async (sql, values = []) => {
  return await pool
    .getConnection()
    .then((conn) => {
      if (typeof values !== "object") {
        throw new Error("Expected values must be an object.");
      }
      const response =
        values.length > 0 ? conn.execute(sql, values) : conn.query(sql);
      conn.release();
      return response;
    })
    .catch((error) => {
      logger.error("Error executing query", {
        query: sql,
        values: values,
        error: error
      })
      return null;
    });
};

export default query;
