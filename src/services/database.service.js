import mysql from "mysql2/promise";

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

const execute = async (sql, params) => {
  try {
    const [rows, cols] = await pool.execute(sql, params);
    pool.releaseConnection();
    return [rows, cols];
  } catch (error) {
    console.error(error);
  }
  return null;
};

const query = async (sql) => {
  try {
    const [rows, cols] = await pool.query(sql);
    pool.releaseConnection();
    console.log([rows, cols]);
    return [rows, cols];
  } catch (error) {
    console.error(error);
  }
  return null;
};

export { execute, query }
