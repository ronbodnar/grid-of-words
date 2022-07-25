import { showView } from "../utils/helpers.js";
import { startGame } from "../services/game.service.js";
import {
  DEFAULT_WORD_LENGTH,
  MINIMUM_WORD_LENGTH,
  MAXIMUM_WORD_LENGTH,
  DEFAULT_MAX_ATTEMPTS,
  MINIMUM_MAX_ATTEMPTS,
  MAXIMUM_MAX_ATTEMPTS,
} from "../constants.js";

/*
 * Builds and displays the options view.
 */
export const buildOptionsView = () => {
  const contentContainer = document.querySelector(".content");
  contentContainer.id = "options";

  const header = document.createElement("h1");
  header.style.marginBottom = "20px";
  header.textContent = "Options";

  const buttonContainer = document.createElement("div");
  buttonContainer.style.marginTop = "40px";
  buttonContainer.classList.add("button-container");

  const backButton = document.createElement("button");
  backButton.classList.add("button", "fixed");
  backButton.type = "button";
  backButton.innerHTML =
    "<img src='/assets/material-icons/keyboard-backspace.svg' style='vertical-align: -6px'/> Back";
  backButton.addEventListener("click", () => {
    showView("home");
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

  buttonContainer.appendChild(backButton);
  buttonContainer.appendChild(startGameButton);

  contentContainer.innerHTML = "";
  contentContainer.appendChild(header);

  // Add the word length slider option
  contentContainer.appendChild(
    buildSliderSection(
      "wordLength",
      "Word Length",
      MINIMUM_WORD_LENGTH,
      MAXIMUM_WORD_LENGTH,
      DEFAULT_WORD_LENGTH
    )
  );

  // Add the max attempts slider option
  contentContainer.appendChild(
    buildSliderSection(
      "maxAttempts",
      "Max Attempts",
      MINIMUM_MAX_ATTEMPTS,
      MAXIMUM_MAX_ATTEMPTS,
      DEFAULT_MAX_ATTEMPTS
    )
  );

  // Add the remember options? button
  contentContainer.appendChild(
    buildCheckboxSection("rememberOptions", "Remember Options?", false)
  )
  
  contentContainer.appendChild(buttonContainer);
};

const buildSliderSection = (id, title, minValue, maxValue, defaultValue) => {
  const container = document.createElement("div");
  container.classList.add("option-row");

  const header = document.createElement("h5");
  header.textContent = title;
  header.style.fontSize = "18px";

  // Todo cookies for preferred/previous value and move to stylesheet
  const sliderContainer = document.createElement("div");
  sliderContainer.style.display = "flex";
  sliderContainer.style.alignItems = "center";
  sliderContainer.style.justifyContent = "space-evenly";
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

const buildCheckboxSection = (id, title, selected) => {
  const container = document.createElement("div");
  container.classList.add("option-row-checkbox");

  const header = document.createElement("h5");
  header.textContent = title;
  header.style.fontSize = "18px";

  const checkbox = document.createElement("input");
  checkbox.type = "checkbox";
  checkbox.selected = selected;
  checkbox.id = `${id}Checkbox`;
  checkbox.style.justifySelf = "start";

  // Add the header text and slider container to the option container
  container.appendChild(header);
  container.appendChild(checkbox);

  return container;
};
