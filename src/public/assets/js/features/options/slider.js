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
  
    const sliderContainer = document.createElement("div");
    sliderContainer.style.display = "flex";
    sliderContainer.style.alignItems = "center";
    sliderContainer.style.justifyContent = "end";
    sliderContainer.style.width = "100%";
  
    const sliderValueLabel = document.createElement("label");
    sliderValueLabel.id = `${id}SliderValue`;
    sliderValueLabel.classList.add("slider-value");
    sliderValueLabel.textContent = defaultValue;
    sliderValueLabel.style.marginBottom = "0";
  
    const sliderInput = document.createElement("input");
    sliderInput.type = "range";
    sliderInput.min = minValue;
    sliderInput.max = maxValue;
    sliderInput.value = defaultValue;
    sliderInput.id = `${id}Slider`;
    sliderInput.addEventListener("input", (event) => {
      sliderValueLabel.innerHTML = event.target.value;
    });
    
    sliderContainer.appendChild(sliderInput);
    sliderContainer.appendChild(sliderValueLabel);

    container.appendChild(header);
    container.appendChild(sliderContainer);
  
    return container;
  };