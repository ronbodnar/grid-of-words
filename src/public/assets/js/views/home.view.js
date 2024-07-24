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
  header.classList.add("view-header");
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
  howToPlayButton.innerHTML = "<img src='/assets/material-icons/help.svg' style='vertical-align: -6px'> How to Play";
  howToPlayButton.addEventListener("click", () => {
    showView('how-to-play');
  });

  const optionsButton = document.createElement("button");
  optionsButton.classList.add("button", "fixed");
  optionsButton.innerHTML = "<img src='/assets/material-icons/tune.svg' style='vertical-align: -6px'> Options";
  optionsButton.addEventListener("click", () => {
    showView("options");
  });

  const startGameButton = document.createElement("button");
  startGameButton.classList.add("button", "fixed");
  startGameButton.type = "button";
  startGameButton.innerHTML = "<img src='/assets/material-icons/play-arrow.svg' style='vertical-align: -6px'> Start Game";
  startGameButton.addEventListener("click", () => {
    startGame({
      wordLength: DEFAULT_WORD_LENGTH,
      maxAttempts: DEFAULT_MAX_ATTEMPTS,
      language: "enUS",
    });
  });

  buttonContainer.appendChild(howToPlayButton);
  buttonContainer.appendChild(startGameButton);
  buttonContainer.appendChild(optionsButton);

  return buttonContainer;
}
