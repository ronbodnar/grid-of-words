import { buildLoaderElement } from '../loading/loader.js'
import { initializeKeyboardKeys, getKeyboardKey } from './keyboard.service.js'

/**
 * Builds the on screen keyboard container and all children.
 *
 * @param {Game} game - The game to render the keyboard for.
 */
export const buildOnScreenKeyboardElement = (game) => {
  initializeKeyboardKeys(game)

  let keyboard = document.createElement('div')
  keyboard.classList.add('keyboard')

  const keys = document.createElement('div')
  keys.classList.add('keyboard-keys')

  // Set up the row layout for the keyboard and iteratively build the rows.
  let rows = [
    ['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p'],
    ['a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l'],
    ['enter', 'z', 'x', 'c', 'v', 'b', 'n', 'm', 'delete']
  ]
  for (let i = 0; i < rows.length; i++) {
    let row = document.createElement('div')
    row.classList.add('keyboard-row')

    for (let j = 0; j < rows[i].length; j++) {
      let key = getKeyboardKey(rows[i][j])

      row.appendChild(key)
    }
    keys.appendChild(row)
  }

  const loadingOverlay = document.createElement('div')
  loadingOverlay.classList.add('flex-center', 'keyboard-overlay', 'hidden')

  const loaderElement = buildLoaderElement()
  loaderElement.classList.add('keyboard-loading')

  loadingOverlay.appendChild(loaderElement)

  keyboard.appendChild(loadingOverlay)
  keyboard.appendChild(keys)

  return keyboard
}
