/**
 * The individual square that houses a single letter in the word grid.
 *
 * @param {boolean} active - Whether the letter is "typeable" or part of the current attempt's row.
 */
export const buildSquareElement = () => {
  // Create the fixed main square element with the border (this is not changed during attempts)
  const square = document.createElement("div")
  square.classList.add("square")

  // Add the value container to house the letter element (this is what's animated during attempts)
  const valueContainer = document.createElement("div")
  valueContainer.classList.add("flex-center", "square-value-container")

  const value = document.createElement("span")
  value.classList.add("square-value")

  valueContainer.appendChild(value)

  square.appendChild(valueContainer)

  return square
}
