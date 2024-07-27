import { retrieve } from "./storage.service.js";

const fetchWordList = async () => {
  var response = await fetch(`word/list`, {
    headers: {
      Authorization: "Bearer v5Pd3vUK9iYjRxCa1H5VsBe9L18xs8UW", // :)
    },
  });
  return await response.json();
};

const wordExists = (word) => {
  const wordList = retrieve("wordList");
  if (!wordList) return true;
  const filtered = wordList.filter((wordInList) => wordInList.word === word);
  return filtered.length > 0;
};

export { wordExists, fetchWordList };
