import fs from 'node:fs';
import path from 'node:path';

const __dirname = import.meta.dirname;

function log(message) {
    console.log(message);
}

function writeToFile(fileName, output) {
    fs.writeFile(path.join(__dirname, "..", fileName), output, (err) => {
      if (err) {
        console.error(err);
      }
    });
  }

export default log;
export { log, writeToFile };