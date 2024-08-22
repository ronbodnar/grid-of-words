import { logger } from "../../main.js";

/**
 * Adds the specified key/value pair to the sessionStorage and encodes the value into JSON.
 * 
 * @param {string} key - The key to store.
 * @param {any} value - The value to store as a JSON string.
 */
export const storeSession = (key, value) => {
  window.sessionStorage.setItem(key, JSON.stringify(value));
};

/**
 * Removes a key from sessionStorage.
 * 
 * @param {string} key - The key to remove from storage.
 */
export const removeSession = (key) => {
  window.sessionStorage.removeItem(key);
};

/**
 * Retrieves the value associated with the given key from sessionStorage.
 * 
 * @param {string} key - The key to look up in storage.
 * @returns {any} - The decoded value associated with the key.
 */
export const retrieveSession = (key) => {
  const value = window.sessionStorage.getItem(key);
  if (!value) return null;
  return JSON.parse(value);
};

/**
 * Adds the specified key/value pair to the localStorage and encodes the value into JSON.
 * 
 * @param {string} key - The key to store.
 * @param {any} value - The value to store as a JSON string.
 */
export const storeLocal = (key, value) => {
  window.localStorage.setItem(key, JSON.stringify(value));
};

/**
 * Removes a key from localStorage.
 * 
 * @param {string} key - The key to remove from storage.
 */
export const removeLocal = (key) => {
  window.localStorage.removeItem(key);
};

/**
 * Retrieves the raw value associated with the given key from localStorage.
 * 
 * @param {string} key - The key to look up in storage.
 * @returns {any} - The decoded value associated with the key.
 */
export const retrieveLocal = (key) => {
  const value = window.localStorage.getItem(key);
  if (!value) return null;
  return JSON.parse(value);
};