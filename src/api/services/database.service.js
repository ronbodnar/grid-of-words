import mysql from "mysql2/promise";
import logger from "../config/winston.config.js";

// Create a connection pool to the MySQL database
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

/*
 * Asynchronously query the database for results, uses prepared statements if values are defined.
 *
 * @param {string} sql - The SQL query to execute.
 * @param {List} values - A list of values to inject into the query string.
 * @return {Promise}
 */
const query = async (sql, values = []) => {
  try {
    // Obtain a connection from the database connection pool.
    const connection = await pool.getConnection();

    // Ensure that the values is an object if provided, otherwise log the error and return null.
    if (typeof values !== "object") {
      logger.error("Expected values must be an object.", {
        query: sql,
        values: values,
      })
      return null;
    }

    // Execute the SQL query with the provided values, or without values if they are not provided.
    const response = values.length > 0 ? connection.execute(sql, values) : connection.query(sql);

    // Release the database connection back to the pool after the query is executed.
    connection.release();

    return response;
  } catch (error) {
    logger.error("Error executing query", {
      query: sql,
      values: values,
      error: error
    })
    return null;
  }
};

export default query;
