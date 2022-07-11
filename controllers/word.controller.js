import * as wordUtils from "../lib/word-utils.js";
import database from "../services/database.service.js";

function getWord(req, res) {
  database(function (err, db) {
    if (err) throw err;
    console.log("DB: ", db);
    return res.end(db);
  });

  return res.end('hey');
}

export { getWord };
