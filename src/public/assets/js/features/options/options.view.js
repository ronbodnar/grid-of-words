import { getRandomInt } from "../../shared/utils/helpers.js";
import {
  DEFAULT_WORD_LENGTH,
  MINIMUM_WORD_LENGTH,
  MAXIMUM_WORD_LENGTH,
  DEFAULT_MAX_ATTEMPTS,
  MINIMUM_MAX_ATTEMPTS,
  MAXIMUM_MAX_ATTEMPTS,
} from "../../shared/utils/constants.js";
import { createButton } from "../../shared/components/button.js";
import { buildView } from "../view/view.js";
import { buildSliderSection } from "./slider.js";

/**
 * Builds and displays the options view.
 */
export const buildOptionsView = () => {
  buildView("options", {
    headerText: "Game Options",
    hasNavigationButton: true,
    additionalElements: [buildOptionsContainer(), buildButtonContainer()],
  });
};

/**
 * Builds the options container that houses the word length and max attempt sliders.
 *
 * @returns {Element} The built options container.
 */
const buildOptionsContainer = () => {
  const optionsContainer = document.createElement("div");
  optionsContainer.classList.add("options-container");

  // Add the word length slider option
  optionsContainer.appendChild(
    buildSliderSection(
      "wordLength",
      "Word Length",
      MINIMUM_WORD_LENGTH,
      MAXIMUM_WORD_LENGTH,
      DEFAULT_WORD_LENGTH
    )
  );

  // Add the max attempts slider option
  optionsContainer.appendChild(
    buildSliderSection(
      "maxAttempts",
      "Max Attempts",
      MINIMUM_MAX_ATTEMPTS,
      MAXIMUM_MAX_ATTEMPTS,
      DEFAULT_MAX_ATTEMPTS
    )
  );

  return optionsContainer;
};

/**
 * Builds the button container with the back, start game, and random game buttons.
 *
 * @returns {Element} The built button container.
 */
const buildButtonContainer = () => {
  const buttonContainer = document.createElement("div");
  buttonContainer.classList.add("button-container");

  const startGameButton = createButton("Start Game", {
    icon: "play-arrow",
    eventArgs: {
      wordLength: document.querySelector("#wordLengthSlider")?.value,
      maxAttempts: document.querySelector("#maxAttemptsSlider")?.value,
    },
  });

  const randomGameButton = createButton("Random Game", {
    icon: "shuffle",
    eventArgs: {
      wordLength: getRandomInt(MINIMUM_WORD_LENGTH, MAXIMUM_WORD_LENGTH),
      maxAttempts: getRandomInt(MINIMUM_MAX_ATTEMPTS, MAXIMUM_MAX_ATTEMPTS),
    },
  });

  buttonContainer.appendChild(startGameButton);
  buttonContainer.appendChild(randomGameButton);

  return buttonContainer;
};