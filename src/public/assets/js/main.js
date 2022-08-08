import {
  removeSession,
  retrieveLocal,
  storeLocal,
  storeSession,
} from "./services/storage.service.js";
import { addKeyListeners } from "./services/event.service.js";
import { showView } from "./utils/helpers.js";
import { fetchWordList } from "./services/word.service.js";

// Initialize the listeners for keyboard events.
addKeyListeners();

// Show the loading view while we fetch session data from the server.
showView("loading");

// Fetch the session data from the server.
const serverResponse = await fetch("/auth/who").catch((error) =>
  console.error("Error fetching session data", error)
);

// Parse the JSON response from the server.
const sessionData = await serverResponse.json();

console.info("Session Data", sessionData);

if (sessionData?.user && sessionData?.user.id) {
  storeSession("user", sessionData.user);
} else {
  removeSession("user");
}

if (sessionData?.game) {
  storeSession("game", sessionData.game);
} else {
  removeSession("game");
}

showView("home");

// Ensure the user has the word list in the local storage, if not, asynchronously fetch and store the word list.
const wordList = retrieveLocal("wordList");
if (!wordList) {
  fetchWordList()
    .then((response) => storeLocal("wordList", response))
    .catch((error) => console.error("Error fetching word list", error));
}
