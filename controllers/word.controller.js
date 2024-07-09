import fs from "node:fs";
import path from "node:path";

const __dirname = import.meta.dirname;

function getWord(req, res) {
}

function readWords(req, res) {
  fs.readFile(path.join(__dirname, "..", "words.txt"), "utf8", (err, data) => {
    if (err) {
      console.error(err);
      return;
    }
    const words = data.split("\n");
    console.log(`${words.length} words found`);

    filterWords(words);

    res.end("done");
  });
}

function filterWords(words) {
  var filteredWords = [];
  var invalidWords = [];

  // Negatively match words against lowercase letters
  var regex = new RegExp(/[^a-z]/);

  filteredWords = words.filter((word) => {
    word = word.trim();
    var valid = true;
    if (regex.test(word)) {
      invalidWords.push(word);
      valid = false;
    }
    return valid;
  });

  logOutput("invalid-words.txt", invalidWords.join("\n"));
  logOutput("filtered-words.txt", filteredWords.join("\n"));

  console.log(`${filteredWords.length} filtered words found`);
}

function logOutput(fileName, output) {
  fs.writeFile(path.join(__dirname, "..", fileName), output, (err) => {
    if (err) {
      console.error(err);
    }
  });
}

export { readWords, filterWords };
