import { getRandomInt } from "../utils/helpers.js";
import {
  DEFAULT_WORD_LENGTH,
  MINIMUM_WORD_LENGTH,
  MAXIMUM_WORD_LENGTH,
  DEFAULT_MAX_ATTEMPTS,
  MINIMUM_MAX_ATTEMPTS,
  MAXIMUM_MAX_ATTEMPTS,
} from "../constants.js";
import {
  clickBackButton,
  clickStartGameButton,
} from "../services/event.service.js";

/**
 * Builds and displays the options view.
 */
export const buildOptionsView = () => {
  const contentContainer = document.querySelector(".content");
  contentContainer.id = "options";

  const backButton = document.createElement("div");
  backButton.classList.add("back-button");
  backButton.innerHTML = "<img src='/assets/material-icons/keyboard-backspace.svg' style='vertical-align: -6px;'> Back";
  backButton.addEventListener("click", clickBackButton);

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

    /*   contentContainer.appendChild(
    buildCheckboxSection("rememberOptions", "Remember Options?", false)
  ); */

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

  const startGameButton = document.createElement("button");
  startGameButton.classList.add("button", "fixed");
  startGameButton.type = "button";
  startGameButton.innerHTML =
    "<img src='/assets/material-icons/play-arrow.svg' style='vertical-align: -6px'> Start Game";
  startGameButton.addEventListener("click", () => {
    const wordLength = document.querySelector("#wordLengthSlider")?.value;
    const maxAttempts = document.querySelector("#maxAttemptsSlider")?.value;
    clickStartGameButton(null, wordLength, maxAttempts);
  });

  const randomGameButton = document.createElement("button");
  randomGameButton.classList.add("button", "fixed");
  randomGameButton.type = "button";
  randomGameButton.innerHTML =
    "<img src='/assets/material-icons/shuffle.svg' style='vertical-align: -6px'> Random Game";
  randomGameButton.addEventListener("click", () => {
    const wordLength = getRandomInt(MINIMUM_WORD_LENGTH, MAXIMUM_WORD_LENGTH);
    const maxAttempts = getRandomInt(
      MINIMUM_MAX_ATTEMPTS,
      MAXIMUM_MAX_ATTEMPTS
    );
    clickStartGameButton(null, wordLength, maxAttempts);
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

/**
 * Builds a checkbox section with a title and a checkbox input.
 *
 * @param {string} id - The unique identifier for the checkbox elements.
 * @param {string} title - The title to display next to the checkbox.
 * @param {boolean} selected - The initial selected state of the checkbox.
 * @returns {HTMLDivElement} The container element containing the checkbox section.
 */
const buildCheckboxSection = (id, title, selected) => {
  const container = document.createElement("div");
  container.classList.add("flex-center", "option-row-checkbox");

  const text = document.createElement("h5");
  text.textContent = title;
  text.style.fontSize = "18px";

  const header = document.createElement("div");
  header.style.textAlign = "start";
  header.appendChild(text);

  const checkboxContainer = document.createElement("div");
  checkboxContainer.style.textAlign = "center";

  const checkbox = document.createElement("input");
  checkbox.type = "checkbox";
  checkbox.selected = selected;
  checkbox.id = `${id}Checkbox`;

  checkboxContainer.appendChild(checkbox);

  // Add the header text and slider container to the option container
  container.appendChild(header);
  container.appendChild(checkboxContainer);

  return container;
};
