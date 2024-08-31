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
export const buildSliderAndLabel = (id, options) => {
  const { minValue, maxValue, defaultValue } = options

  const sliderValueLabel = document.createElement('label')
  sliderValueLabel.id = `${id}SliderValue`
  sliderValueLabel.classList.add('slider-value')
  sliderValueLabel.textContent = defaultValue
  sliderValueLabel.style.marginBottom = '0'

  const sliderInput = document.createElement('input')
  sliderInput.type = 'range'
  sliderInput.min = minValue
  sliderInput.max = maxValue
  sliderInput.value = defaultValue
  sliderInput.id = `${id}Slider`
  sliderInput.addEventListener('input', (event) => {
    sliderValueLabel.innerHTML = event.target.value
  })

  return [sliderInput, sliderValueLabel]
}
