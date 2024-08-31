import { buildKeyElement } from './key.js'
import { getLetterStates } from '../../../shared/utils/helpers.js'
import { EXACT_MATCH, NO_MATCH, PARTIAL_MATCH } from '../../../shared/utils/constants.js'

let keyboardKeys = {}

/**
 * Initializes the keyboardKeys object by building key elements for A-Z, enter, and delete keys.
 *
 * @param {Game} game - The game to fetch letter match states for.
 */
export const initializeKeyboardKeys = (game) => {
  const letterStates = game ? getLetterStates(game.word, game.attempts) : undefined

  let enterKey = buildKeyElement('enter', false)
  enterKey.classList.add('enter-key')
  keyboardKeys['enter'] = enterKey

  let deleteKey = buildKeyElement('delete', false)
  deleteKey.classList.add('delete-key')
  keyboardKeys['delete'] = deleteKey

  // Create the keys for A-Z.
  for (let i = 97; i <= 122; i++) {
    const letter = String.fromCharCode(i)
    keyboardKeys[letter] = buildKeyElement(letter, letterStates ? letterStates[letter] : undefined)
  }
}

/**
 * Updates the keyboard keys background colors to their match states.
 * @param {string} gameWord - The current game word.
 * @param {string} attemptWord - The current attempt word.
 */
export const updateKeyboardKeys = (gameWord, attemptedWord) => {
  const letterMatchStates = getLetterStates(gameWord, [attemptedWord])

  for (let i = 0; i < attemptedWord.length; i++) {
    const letter = attemptedWord.at(i)
    const key = getKeyboardKey(letter, letterMatchStates[letter])

    if (!key) {
      throw new Error(`Could not update missing key for letter: ${letter}`)
    }

    switch (letterMatchStates[letter]) {
      case EXACT_MATCH:
        if (key.classList.contains('partial')) {
          key.classList.remove('partial')
        }
        key.classList.add('exact')
        break

      case PARTIAL_MATCH:
        if (!key.classList.contains('exact')) {
          key.classList.add('partial')
        }
        break

      case NO_MATCH:
        if (!key.classList.contains('exact') && !key.classList.contains('partial')) {
          key.classList.add('incorrect')
        }
        break
    }
  }
}

/**
 * Toggles the keyboard overlay, or sets it to visible/hidden if specified.
 *
 * @param {boolean} visible - Whether the overlay should be visible.
 */
export const toggleKeyboardOverlay = (visible) => {
  const overlay = document.querySelector('.keyboard-overlay')
  if (!overlay) return
  if (visible != null && visible) {
    overlay.classList.remove('hidden')
  } else if (visible != null && !visible) {
    overlay.classList.add('hidden')
  } else {
    overlay.classList.toggle('hidden')
  }
}

/**
 * Gets the key element for the given letter.
 *
 * @param {string} char - The letter of the key element to find.
 */
export const getKeyboardKey = (char) => {
  return keyboardKeys[char]
}
