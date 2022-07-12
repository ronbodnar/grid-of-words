import query from "../services/database.service.js";

async function getRandomWord(req, res) {
  var sql =
    "" +
    "SELECT word FROM words AS w1 " +
    "JOIN (SELECT uuid FROM words ORDER BY RAND() LIMIT 1) as w2 " +
    "ON w1.uuid = w2.uuid";
  const data = await query(sql);
  return data?.word;
}

export { getRandomWord };
