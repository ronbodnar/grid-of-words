/*
 * Adds the specified key/value pair to the local storage with an expiration timestamp.
 * @param {string} key - The key to store.
 * @param {string} value - The value to store.
 */
const store = (key, value, expires = undefined) => {
  const expirationTimestamp = new Date();
  expirationTimestamp.setTime(expirationTimestamp.getTime() + (24 * 60 * 60 * 1000)) // 24 hours from now

  if (expires)
    expirationTimestamp = expires;

  value = JSON.stringify({
    data: value,
    timestamp: expirationTimestamp.toISOString(),
  });
  window.localStorage.setItem(key, value);
};

/*
 * Removes a key from local storage.
 * @param {string} key - The key to remove from storage.
 */
const remove = (key) => {
  window.localStorage.removeItem(key);
}


/*
 * Retrieves the storage value associated with the given key.
 * @param {string} key - The key to look up in storage.
 * @return {string} - The value associated with the key.
 */
const retrieve = (key) => {
  if (!isValid(key)) return undefined;
  return JSON.parse(window.localStorage.getItem(key));
};

/*
 * Checks to see if the key exists, then determines if the timestamp is valid.
 * @param {string} key - The key to look up in storage.
 * @return {boolean} - True if the key exists and the timestamp is valid, false otherwise.
 */
const isValid = (key) => {
  const item = JSON.parse(window.localStorage.getItem(key));
  if (!item) return false;

  // Check to see if the expiration timestamp has past.
  const now = new Date();
  const expirationTimestamp = new Date(item.timestamp);
  if (expirationTimestamp.getTime() < now.getTime()) {
    remove(key); // Expired, remove from storage.
    return false;
  }
  return true;
};

export { store, remove, retrieve, isValid };
