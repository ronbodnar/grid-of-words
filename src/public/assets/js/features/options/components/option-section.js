import { convertToCamelCase } from "../../../shared/utils/helpers.js"
import OPTION_TYPE from "../enums/OptionType.js"
import { buildSelect } from "./select.js"
import { buildSliderAndLabel } from "./slider.js"

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
export const buildOptionSection = (option) => {
  const { id, title, type, typeOptions } = option;
  const isSelect = type === OPTION_TYPE.SELECT

  const container = document.createElement('div')
  container.classList.add('flex-center', 'option-row')
  container.style.flexDirection = 'row'
  container.id = convertToCamelCase(title)

  const header = document.createElement('h5')
  header.textContent = title
  header.style.fontSize = '18px'

  const typeContainer = document.createElement('div')
  typeContainer.id = `${option.id}-container`
  typeContainer.style.display = 'flex'
  typeContainer.style.alignItems = 'center'
  typeContainer.style.justifyContent = isSelect ? 'start' : 'end'

  switch (type) {
    case OPTION_TYPE.SELECT:
      const selectElement = buildSelect(id, typeOptions);
      typeContainer.appendChild(selectElement)
      break;

    case OPTION_TYPE.SLIDER:
      const [slider, input] = buildSliderAndLabel(id, typeOptions);
      typeContainer.appendChild(slider)
      typeContainer.appendChild(input)
      break;
  }

  container.appendChild(header)
  container.appendChild(typeContainer)
  return container
}