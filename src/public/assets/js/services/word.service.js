import { retrieve } from "./storage.service.js";

const fetchWordList = async () => {
    var response = await fetch(`word/list`);
    return await response.json();
}

const wordExists = (word) => {
    const wordList = retrieve('wordList');
    if (!wordList) return true;
    const filtered = wordList.data.filter((wordInList) => wordInList.word === word);
    return filtered.length > 0;
}

export { wordExists, fetchWordList }