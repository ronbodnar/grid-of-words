import { showView } from "../utils/helpers.js";
import { startGame } from "../services/game.service.js";
import { DEFAULT_WORD_LENGTH, DEFAULT_MAX_ATTEMPTS } from "../constants.js";

/*
 * Renders the home container view.
 */
export const buildHomeView = () => {
  const contentContainer = document.querySelector(".content");
  contentContainer.id = "home";

  const header = document.createElement("h1");
  header.textContent = "Word Game";

  // Options container, create a component
  const buttonContainer = buildButtonContainer();

  contentContainer.innerHTML = '';
  contentContainer.appendChild(header);
  contentContainer.appendChild(buttonContainer);
};

const buildButtonContainer = () => {
  const buttonContainer = document.createElement("div");
  buttonContainer.classList.add("button-container");

  const howToPlayButton = document.createElement("button");
  howToPlayButton.classList.add("button", "fixed");
  howToPlayButton.type = "button";
  howToPlayButton.textContent = "How to Play";
  howToPlayButton.addEventListener("click", () => {
    showView('how-to-play');
  });

  const optionsButton = document.createElement("span");
  optionsButton.classList.add("material-icon");
  optionsButton.innerHTML = "<img src='/assets/material-icons/tune.svg'>";
  optionsButton.addEventListener("click", () => {
    showView("options");
  });

  const startGameButton = document.createElement("button");
  startGameButton.classList.add("button", "fixed");
  startGameButton.type = "button";
  startGameButton.textContent = "Start Game";
  startGameButton.addEventListener("click", () => {
    startGame({
      wordLength: DEFAULT_WORD_LENGTH,
      maxAttempts: DEFAULT_MAX_ATTEMPTS,
      timed: false,
      language: "enUS",
    });
  });

  buttonContainer.appendChild(howToPlayButton);
  buttonContainer.appendChild(optionsButton);
  buttonContainer.appendChild(startGameButton);

  return buttonContainer;
}
