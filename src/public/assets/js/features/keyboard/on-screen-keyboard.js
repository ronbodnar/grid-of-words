import { buildLoadingElement } from "../../components/loading.js";
import { initializeKeyboardKeys, getKeyboardKey } from "../keyboard/keyboard.service.js";

/**
 * Builds the on screen keyboard container and all children.
 *
 * @param {Game} game - The game to render the keyboard for.
 */
export const buildOnScreenKeyboardElement = (game) => {
  let rows = [
    ["q", "w", "e", "r", "t", "y", "u", "i", "o", "p"],
    ["a", "s", "d", "f", "g", "h", "j", "k", "l"],
    ["enter", "z", "x", "c", "v", "b", "n", "m", "delete"],
  ];

  initializeKeyboardKeys(game);

  let keyboard = document.createElement("div");
  keyboard.classList.add("keyboard");

  const keys = document.createElement("div");
  keys.classList.add("keyboard-keys");

  for (let i = 0; i < rows.length; i++) {
    let row = document.createElement("div");
    row.classList.add("keyboard-row");

    for (let j = 0; j < rows[i].length; j++) {
      let key = getKeyboardKey(rows[i][j]);

      row.appendChild(key);
    }
    keys.appendChild(row);
  }

  // Set up the loading overlay for the keyboard
  const overlay = document.createElement("div");
  overlay.classList.add("flex-center", "keyboard-overlay", "hidden");

  const loading = buildLoadingElement();
  loading.classList.add("keyboard-loading");

  overlay.appendChild(loading);

  keyboard.appendChild(overlay);
  keyboard.appendChild(keys);

  return keyboard;
};
