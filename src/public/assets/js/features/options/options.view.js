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

/**
 * Builds and displays the options view.
 */
export const buildOptionsView = () => {
  const contentContainer = document.querySelector(".content");
  contentContainer.id = "options";

  const backButton = createButton("Back", "back", {
    icon: "keyboard-backspace",
    classes: ["back-button"]
  });
  
  const header = document.createElement("h1");
  header.classList.add("view-header");
  header.textContent = "Options";

  contentContainer.innerHTML = "";
  contentContainer.appendChild(backButton);
  contentContainer.appendChild(header);
  contentContainer.appendChild(buildOptionsContainer());
  contentContainer.appendChild(buildButtonContainer());
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

  const startGameButton = createButton("Start Game", "startGame", {
    icon: "play-arrow",
    eventArgs: {
      wordLength: document.querySelector("#wordLengthSlider")?.value,
      maxAttempts: document.querySelector("#maxAttemptsSlider")?.value,
    }
  });

  const randomGameButton = createButton("Random Game", "randomGame", {
    icon: "shuffle",
    eventArgs: {
      wordLength: getRandomInt(MINIMUM_WORD_LENGTH, MAXIMUM_WORD_LENGTH),
      maxAttempts: getRandomInt(
        MINIMUM_MAX_ATTEMPTS,
        MAXIMUM_MAX_ATTEMPTS
      ),
    }
  });

  buttonContainer.appendChild(startGameButton);
  buttonContainer.appendChild(randomGameButton);

  return buttonContainer;
};

/**
 * Builds a slider section with a title, slider input, and a display of the current value.
 *
 * @param {string} id - The unique identifier for the slider elements.
 * @param {string} title - The title to display above the slider.
 * @param {number} minValue - The minimum value for the slider.
 * @param {number} maxValue - The maximum value for the slider.
 * @param {number} defaultValue - The default value for the slider.
 * @returns {HTMLDivElement} The container element containing the slider section.
 */
const buildSliderSection = (id, title, minValue, maxValue, defaultValue) => {
  const container = document.createElement("div");
  container.classList.add("flex-center", "option-row");

  const header = document.createElement("h5");
  header.textContent = title;
  header.style.fontSize = "18px";

  // Todo cookies for preferred/previous value and move to stylesheet
  const sliderContainer = document.createElement("div");
  sliderContainer.style.display = "flex";
  sliderContainer.style.alignItems = "center";
  sliderContainer.style.justifyContent = "end";
  sliderContainer.style.width = "100%";

  // The text showing what the value of the word length slider is
  const inputValue = document.createElement("p");
  inputValue.id = `${id}SliderValue`;
  inputValue.classList.add("slider-value");
  inputValue.textContent = defaultValue;

  // Set up the slider element
  const inputSlider = document.createElement("input");
  inputSlider.type = "range";
  inputSlider.min = minValue;
  inputSlider.max = maxValue;
  inputSlider.value = defaultValue;
  inputSlider.id = `${id}Slider`;
  inputSlider.addEventListener("input", (event) => {
    inputValue.innerHTML = event.target.value;
  });

  // Add the slider components to the slider container
  sliderContainer.appendChild(inputSlider);
  sliderContainer.appendChild(inputValue);

  // Add the header text and slider container to the option container
  container.appendChild(header);
  container.appendChild(sliderContainer);

  return container;
};