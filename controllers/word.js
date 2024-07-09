import fs from "node:fs";
import path from "node:path";

const __dirname = import.meta.dirname;

export const readWords = function (req, res) {
  fs.readFile(path.join(__dirname, "..", "words.txt"), "utf8", (err, data) => {
    if (err) {
      console.error(err);
      return;
    }
    const words = data.split("\n");
    console.log(`${words.length} words found`);

    res.end(`Words Found: ${words.length}`);
  });
};
