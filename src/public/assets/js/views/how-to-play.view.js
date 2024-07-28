import { clickBackButton, clickStartGameButton } from "../services/event.service.js";

/**
 * Builds and displays the how-to-play view within the content container.
 */
export const buildHowToPlayView = () => {
  const steps = [
    "Select or type the letters of a 5<sup>*</sup> letter word, like <strong>great</strong> or <strong>place</strong>.",
    "Once you have entered a word, press enter to validate your attempt.",
    "If the square is <span style='font-size: 20px; opacity: 0.3; font-weight: 800;'>dimmed</span>, the letter does not exist in the word.",
    "If the square is <span style='font-size: 20px; color: rgba(255, 165, 0, 1); font-weight: 800;'>orange</span>, the letter is not in the correct position in the word.",
    "If the square is <span style='font-size: 20px; color: rgba(0, 163, 108, 1); font-weight: 800;'>green</span>, the letter is in the correct position in the word.",
    "Try to guess the correct word before your 6<sup>th</sup><sup>*</sup> attempt!",
    "<small style='font-size: 14px; font-weight: 500; font-style: italic; margin-left: 20px;'>* Default values. Both word length and maximum attempts can be modified in the game options.</small>",
  ];

  // Build the HTML for the How To Play view.
  const contentContainer = document.querySelector(".content");
  contentContainer.id = "how-to-play";

  const header = document.createElement("h1");
  header.classList.add("view-header");
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
    step.style.margin = "20px 0";
    step.style.fontSize = "20px";
    if (i === steps.length - 1) step.innerHTML = `${steps[i]}`;
    else step.innerHTML = `${i + 1}. ${steps[i]}`;
    stepList.appendChild(step);
  }
  stepElement.appendChild(stepList);

  const buttonContainer = document.createElement("div");
  buttonContainer.classList.add("button-container");

  const backButton = document.createElement("button");
  backButton.classList.add("button", "fixed");
  backButton.type = "button";
  backButton.innerHTML =
    "<img src='/assets/material-icons/keyboard-backspace.svg' style='vertical-align: -6px'/> Back";
  backButton.addEventListener("click", clickBackButton);

  const startGameButton = document.createElement("button");
  startGameButton.classList.add("button", "fixed");
  startGameButton.type = "button";
  startGameButton.innerHTML =
    "<img src='/assets/material-icons/play-arrow.svg' style='vertical-align: -6px'> Start Game";
  startGameButton.addEventListener("click", clickStartGameButton);

  buttonContainer.appendChild(backButton);
  buttonContainer.appendChild(startGameButton);

  contentContainer.innerHTML = "";
  contentContainer.appendChild(header);
  contentContainer.appendChild(stepElement);
  contentContainer.appendChild(buttonContainer);
};
