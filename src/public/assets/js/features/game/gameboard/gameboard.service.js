import { getValidatedLetters } from "../../../shared/utils/helpers.js"
import { getAttemptLetters } from "../attempt/attempt.service.js"
import {
  NO_MATCH,
  EXACT_MATCH,
  PARTIAL_MATCH,
} from "../../../shared/utils/constants.js"

/**
 * Moves the active class from the current row to the next row for new word attempts.
 */
export const shiftActiveRow = () => {
  const currentRow = document.querySelector(".word-row.active")
  const nextRow = currentRow?.nextElementSibling

  // Swap the active class from the current to the next row.
  currentRow?.classList?.remove("active")
  nextRow?.classList?.add("active")
  updateActiveSquareHighlight()
}

/**
 * Animates the showing and hiding of the letters in the row by changing the opacity on an increasing timeout interval.
 *
 * @param {boolean} hide - Whether to hide the squares or not.
 * @param {boolean} instant - Whether the hiding/showing of squares should be instant.
 * @returns {Promise} The promise resolves when all squares are hidden/shown, plus an additional delay of 300 milliseconds.
 */
export const transformSquares = (hide, instant) => {
  const activeRow = document.querySelector(".word-row.active")
  if (!activeRow) return Promise.reject(new Error("No active row found"))

  const squares = Array.from(activeRow.children)
  return new Promise((resolve) => {
    let delay = 0
    squares.forEach((square, i) => {
      setTimeout(
        () => {
          const squareValue = square.children[0]
          if (squareValue) {
            squareValue.style.opacity = hide ? "0" : "1"
          }
          if (i === squares.length - 1) {
            // Resolve the Promise 300ms after the last square has processed.
            setTimeout(() => resolve(true), instant ? 0 : 300)
          }
        },
        hide ? 0 : (delay += instant ? 0 : 300)
      )
    })
  })
}

/**
 * Validates and fills the letter into the next available square in the row and pushes to the stack of attempt letters.
 *
 * @param {string} letter - The letter to be filled into the next available square.
 */
export const fillNextSquare = (letter) => {
  if (/[^a-zA-Z]/.test(letter)) {
    return
  }

  const activeSquare = document.querySelector(
    ".word-row.active > .square:not(.full)"
  )
  if (activeSquare) {
    activeSquare.classList.add("full")

    const nextAvailableSquare = activeSquare.children[0]
    nextAvailableSquare.textContent = letter.toUpperCase()

    // Peak animations right here
    nextAvailableSquare.style.transition = "0.3s"
    nextAvailableSquare.style.transform = "scale(1.3)"
    setTimeout(() => {
      nextAvailableSquare.style.transform = "scale(1)"
    }, 200)

    getAttemptLetters().push(letter.toLowerCase())
    updateActiveSquareHighlight()
  }
}

export const updateActiveSquareHighlight = () => {
  const row = document.querySelector(".word-row.active")
  if (!row) {
    return
  }

  // Remove previous highlight
  row
    .querySelectorAll(".square.first-empty")
    .forEach((s) => s.classList.remove("first-empty"))

  const firstEmpty = Array.from(row.querySelectorAll(".square")).find(
    (s) => !s.classList.contains("full")
  )

  if (firstEmpty) firstEmpty.classList.add("first-empty")
}

/**
 * Pops the stack of letters in the attempt word and updates the square text content.
 */
export const removeLastSquareValue = () => {
  const activeRowSquares = document.querySelectorAll(
    ".word-row.active > .square:is(.full)"
  )

  if (getAttemptLetters().length > 0) {
    const lastSquare = activeRowSquares[getAttemptLetters().length - 1]
    if (!lastSquare) {
      console.error(
        "Encountered a bug in the attempt where attemptLetters seems to be inconsistent.",
        {
          activeRowSquares: activeRowSquares,
          attemptLetters: getAttemptLetters(),
        }
      )
      return
    }
    lastSquare.classList.remove("full")
    lastSquare.children[0].textContent = ""
    getAttemptLetters().pop()
    updateActiveSquareHighlight()
  }
}

/**
 * Animates the current attempt's results and updates the squares state.
 *
 * @param {string} word - The current word being guessed.
 */
export const updateCurrentAttemptSquares = (word) => {
  const validatedPositions = getValidatedLetters(
    getAttemptLetters().join(""),
    word
  )
  const squaresWithLetters = document.querySelectorAll(
    ".word-row.active > .square:is(.full) > .square-value-container"
  )

  if (validatedPositions.length !== squaresWithLetters.length) {
    throw new Error("Invalid number of square elements detected")
  }

  for (let i = 0; i < validatedPositions.length; i++) {
    updateSquareBackground(squaresWithLetters[i], validatedPositions[i])
  }
  updateActiveSquareHighlight()
}

/**
 * Updates the background color of a square based on its match state.
 *
 * @param {HTMLElement} square - The square element to update.
 * @param {number} match - The match state of the square.
 */
export const updateSquareBackground = (square, match) => {
  switch (match) {
    case EXACT_MATCH:
      square.style.background = "var(--exact-match)"
      break

    case PARTIAL_MATCH:
      square.style.background = "var(--partial-match)"
      break

    case NO_MATCH:
      square.style.background = "var(--no-match)"
      break
  }
}
