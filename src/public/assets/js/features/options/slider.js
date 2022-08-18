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
export const buildSliderSection = (id, title, minValue, maxValue, defaultValue) => {
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