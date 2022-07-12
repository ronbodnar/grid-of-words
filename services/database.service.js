import mysql from "mysql2/promise";

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

const query = async (sql) => {
  return pool
    .getConnection()
    .then((connection) => {
      const response = connection.query(sql);
      connection.release();
      return response;
    })
    .then((result) => {
      return result[0][0];
    })
    .catch((err) => console.log("MySQL Query Error: ", err));
};

export default query;
