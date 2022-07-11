import mysql from "mysql2";

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

const query = (sql, callback) => {
  pool.getConnection(function (err, connection) {
    if (err) {
      console.log(err);
      callback(true);
      return;
    }
    connection.query(sql, function (err, result) {
      if (err) {
        console.log(err);
        callback(true);
        return;
      }
      callback(false, result);

      // Release the connection back to the pool
      connection.release();
    });
  });
};

export default query;
