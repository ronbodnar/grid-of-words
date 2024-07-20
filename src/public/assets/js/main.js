import { retrieve, store } from "./services/storage.service.js";
import { initialize as initializeEventListeners } from "./event-listeners.js";
import { showView } from "./utils/helpers.js";
import { fetchGameData } from "./services/game.service.js";
import { fetchWordList } from "./services/word.service.js";

// Initialize the listeners for key and button events.
initializeEventListeners();

// Check local storage for data
// If nothing is found, show the loading view and fetch any data from the server.
// If a game is found, load the game view.
// If a game is not found, show the home view.

// Ensure the user has the word list in the local storage, if not fetch and store the word list.
const wordList = retrieve("wordList");
if (wordList) {
  console.log("Retrieved word list: ", wordList);
} else {
  var data = await fetchWordList();
  store("wordList", data);
  console.log("Fetched word list: ", data);
}

const cachedGame = retrieve("game");
if (cachedGame) {
  // Maybe verify the game with the server?
  showView("game", {
    game: cachedGame.data,
  });
} else {
  showView("loading");

  const serverData = await fetch("/session");
  const sessionData = await serverData.json();

  if (sessionData && Object.keys(sessionData).length > 0) {
    console.log("Received session data: ", sessionData);
  } else {
    showView("home");
  }
}