import { showView } from "../utils/helpers.js";
import { startGame } from "../services/game.service.js";
import { DEFAULT_WORD_LENGTH, DEFAULT_MAX_ATTEMPTS } from "../constants.js";

const buildHowToPlayView = () => {
  const steps = [
    "Select or type the letters of a 5<sup>*</sup> letter word, like <strong>great</strong> or <strong>place</strong>.",
    "Once you have entered a word, press enter to validate your attempt.<br /><small style='font-size: 18px; padding-left: 25px;'>You'll have 6<sup>*</sup> attempts to guess the correct word.</small>",
    "If the square is <span style='opacity: 0.4; font-weight: 600;'>dimmed</span>, the letter does not exist in the word.",
    "If the square is <span style='color: rgba(255, 165, 0, 0.6); font-weight: 600;'>orange</span>, the letter is not in the correct position in the word.",
    "If the square is <span style='color: rgba(0, 163, 108, 0.6); font-weight: 600;'>green</span>, the letter is in the correct position in the word.",
    "Try to guess the correct word before running out of attempts!"
  ];

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
    console.log(steps[i]);
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
  howToPlayButton.innerHTML = "<span class='material-symbols-outlined' style='font-size: 24px; vertical-align: -6px'>arrow_back</span> Back";
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
