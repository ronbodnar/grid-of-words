import { retrieve, store } from "./services/storage.service.js";
import { initialize as initializeEventListeners } from "./event-listeners.js";
import { showView } from "./utils/helpers.js";
import { fetchWordList } from "./services/word.service.js";

// Initialize the listeners for key and button events.
initializeEventListeners();

// Ensure the user has the word list in the local storage, if not, asynchronously fetch and store the word list.
const wordList = retrieve("wordList");
if (!wordList) {
  fetchWordList().then((response) => store("wordList", response));
}

// Check to see if we have a local game in progress, otherwise check with the server.
// (Need to check with the server anyways for good measure, but non-blocking)
const cachedGame = retrieve("game");
if (cachedGame) {
  showView("game", {
    game: cachedGame,
  });
} else {
  showView("loading");

  const serverData = await fetch("/session", {
    headers: {
      Authorization: "Bearer v5Pd3vUK9iYjRxCa1H5VsBe9L18xs8UW", // :)
    },
  });
  const sessionData = await serverData.json();

  if (sessionData && Object.keys(sessionData).length > 0) {
    store("game", sessionData);
    console.log("Received session data: ", sessionData);
    // This should only occur if the user clears local storage on exit or if forfeit is used.
    showView("game", {
      game: sessionData.game,
    });
  } else {
    showView("home");
  }
}
