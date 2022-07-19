import { showView } from "../utils/helpers.js";
import { startGame } from "../services/game.service.js";
import { DEFAULT_WORD_LENGTH, DEFAULT_MAX_ATTEMPTS } from "../constants.js";

const buildHowToPlayView = () => {
  const steps = [
    "Select or type the letters of a 5<sup>*</sup> letter word, like <em>great</em> or <em>place</em>.",
    "Once you have entered a word, press enter to validate your attempt.<br /><small style='font-size: 18px; padding-left: 25px;'>You'll have 6<sup>*</sup> attempts to guess the correct word.</small>",
    "If the square is dimmed, the letter does not exist in the word.",
    "If the square is orange, the letter is not in the correct position in the word.",
    "If the square is green, the letter is in the correct position in the word.",
    "Try to guess the correct word before running out of attempts!"
  ];

  console.log("howdy");
  // Build the HTML for the How To Play view.
  const contentContainer = document.querySelector(".content");
  contentContainer.id = "how-to-play";

  const header = document.createElement("h1");
  header.style.marginBottom = "20px";
  header.textContent = "How to Play Word Game";

  const stepElement = document.createElement("div");
  stepElement.style.display = "flex";
  stepElement.style.textAlign = "start";
  stepElement.style.flexDirection = "column";
  stepElement.style.alignItems = "center";
  stepElement.classList.add("how-to-play-steps");

  const stepList = document.createElement("ul");
  stepList.style.listStyleType = "none";

  for (let i = 0; i < steps.length; i++) {
    let step = document.createElement("li");
    step.style.margin = "20px 0"
    step.style.fontSize = "20px";
    step.innerHTML = `${i+1}. ${steps[i]}`;
    stepList.appendChild(step);
  }
  stepElement.appendChild(stepList);

  const buttonContainer = document.createElement("div");
  buttonContainer.style.marginTop = "40px";
  buttonContainer.classList.add("button-container");

  const howToPlayButton = document.createElement("button");
  howToPlayButton.classList.add("button", "fixed");
  howToPlayButton.type = "button";
  howToPlayButton.textContent = "Back Home";
  howToPlayButton.addEventListener("click", () => {
    showView('home');
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
  buttonContainer.appendChild(startGameButton);

  contentContainer.innerHTML = "";
  contentContainer.appendChild(header);
  contentContainer.appendChild(stepElement);
  contentContainer.appendChild(buttonContainer);
};

export { buildHowToPlayView };
