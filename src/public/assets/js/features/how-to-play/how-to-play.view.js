import { createButton } from "../../shared/components/button.js";
import { buildView } from "../view/view.js";

/**
 * Builds and displays the how-to-play view within the content container.
 */
export const buildHowToPlayView = () => {
  buildView("howToPlay", {
    header: {
      text: "How to Play",
    },
    additionalElements: [buildStepContainer(), buildButtonContainer()],
  });
};

/**
 * Builds a step container with an unordered list of steps from the steps array.
 *
 * @returns {Element} The step container element.
 */
const buildStepContainer = () => {
  const stepContainer = document.createElement("div");
  stepContainer.classList.add("how-to-play-steps");

  const stepList = document.createElement("ul");
  stepList.style.listStyleType = "none";

  const steps = [
    "Select or type the letters of a 5<sup>*</sup> letter word, like <strong>great</strong> or <strong>place</strong>.",
    "Once you have entered a word, press enter to validate your attempt.",
    "If the square is <span style='font-size: 20px; opacity: 0.3; font-weight: 800;'>dimmed</span>, the letter does not exist in the word.",
    "If the square is <span style='font-size: 20px; color: rgba(255, 165, 0, 1); font-weight: 800;'>orange</span>, the letter is not in the correct position in the word.",
    "If the square is <span style='font-size: 20px; color: rgba(0, 163, 108, 1); font-weight: 800;'>green</span>, the letter is in the correct position in the word.",
    "Try to guess the correct word before your 6<sup>th</sup><sup>*</sup> attempt!",
    "<small style='font-size: 14px; font-weight: 500; font-style: italic; margin-left: 20px;'>* Default values. Both word length and maximum attempts can be modified in the game options.</small>",
  ];
  steps.forEach((step, i) => {
    let stepElement = document.createElement("li");
    // TODO: add to stylesheet
    stepElement.style.margin = "20px 0";
    stepElement.style.fontSize = "20px";
    if (i === steps.length - 1) {
      stepElement.innerHTML = `${step}`;
    } else {
      stepElement.innerHTML = `${i + 1}. ${step}`;
    }
    stepList.appendChild(stepElement);
  });

  stepContainer.appendChild(stepList);

  return stepContainer;
};

/**
 * Builds the button container with back and start buttons.
 *
 * @returns {Element} The button container element.
 */
const buildButtonContainer = () => {
  const buttonContainer = document.createElement("div");
  buttonContainer.classList.add("button-container");

  const startGameButton = createButton("Start Game", {
    icon: "play-arrow",
  });

  buttonContainer.appendChild(startGameButton);

  return buttonContainer;
};
