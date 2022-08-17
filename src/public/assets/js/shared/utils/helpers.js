import { EXACT_MATCH, PARTIAL_MATCH, NO_MATCH } from "./constants.js";

/**
 * Compares two words of assumed equal length to see which guessWord letter positions match, are invalid, or don't exist in the gameWord.
 * @param {string} guessWord - The word to compare against the known correct word.
 * @param {string} targetWord - The known word to compare against.
 * @return {list} - The in-order list of the guessWord letters placement validation.
 */
export const getValidatedLetters = (guessWord, targetWord) => {
  if (targetWord.length !== guessWord.length) {
    console.error("Words must be of the same length");
    return null;
  }

  const length = targetWord.length;
  const results = new Array(length).fill(NO_MATCH);
  const targetCount = {};
  const usedCount = {};

  // Perform a pass for all correctly positioned letters and update target counts for remaining letters
  for (let i = 0; i < length; i++) {
    const targetChar = targetWord[i];
    if (guessWord[i] === targetChar) {
      results[i] = EXACT_MATCH;
    } else {
      targetCount[targetChar] = (targetCount[targetChar] || 0) + 1;
    }
  }

  // Perform a pass for all incorrectly positioned letters
  for (let i = 0; i < length; i++) {
    if (results[i] === 1) continue;

    const guessChar = guessWord[i];

    if (targetCount[guessChar] > (usedCount[guessChar] || 0)) {
      results[i] = PARTIAL_MATCH;
      usedCount[guessChar] = (usedCount[guessChar] || 0) + 1;
    }
  }

  return results;
};

/**
 * Determines the states of letters (exact, partial, or no match) between to words for updating the on-screen keyboard.
 * @param {string} targetWord - The target word to compare against.
 * @param {object} attemptedWords - An array of attempted words to compare.
 * @return {object} - The states of each letter found.
 */
export const getLetterStates = (gameWord, attemptedWords) => {
  let letterMatchStates = [];

  // Iterate each attempted word in the list of attemptedWords.
  for (let i = 0; i < attemptedWords.length; i++) {
    let word = attemptedWords[i];

    // Iterate each character in the attempted word.
    for (let j = 0; j < word.length; j++) {
      if (gameWord.at(j) === word.at(j)) {
        // The letters match.
        letterMatchStates[word.at(j)] = EXACT_MATCH;
      } else if (gameWord.includes(word.at(j))) {
        // The letter is in the gameWord.
        if (letterMatchStates[word.at(j)] === EXACT_MATCH) {
          // The letter was already found previously as an exact match, so skip it.
          continue; // Skip this character as it's already been matched.
        }
        letterMatchStates[word.at(j)] = PARTIAL_MATCH;
      } else {
        // The letter was not found.
        letterMatchStates[word.at(j)] = NO_MATCH;
      }
    }
  }

  // If there are no matched letters, return null instead of the letterMatchStates.
  return Object.keys(letterMatchStates).length > 0 ? letterMatchStates : null;
};

/**
 * Gets a random integer between the specified min and max range.
 * @param {number} min - The minimum value for the random integer.
 * @param {number} max - The maximum value for the random integer.
 * @return {number} - The random numer.
 */
export const getRandomInt = (min, max) => {
  return Math.floor(Math.random() * (max - min) + min);
};

/**
 * Fetches and parses data using the fetch API and injects the statusCode into the response JSON object.
 *
 * @param {*} url The URL to fetch data from.
 * @param {*} params An object of key/values to pass in the query (GET) or body (POST, PUT, etc) parameters.
 * @param {*} method The request method to use with the fetch request.
 * @returns {Promise<any>} A promise that resolves when the data has been made available.
 */
export const fetchData = async (url, method, params) => {
  const allowedMethods = ["GET", "POST", "PUT", "PATCH", "DELETE"];

  method = method || "GET";
  params = params || {};

  // Verify that the method is allowed.
  if (!allowedMethods.includes(method)) {
    console.error(
      `Invalid method: ${method}. Only ${allowedMethods.join(
        ", "
      )} are allowed.`
    );
    return null;
  }

  // Wait for the fetch API to respond with the data from the url.
  const fetchResponse = await fetch(url, {
    headers: {
      "Content-Type": "application/json",
    },
    method: method,

    // Body will only be populated with data if the request method isn't GET.
    body: method !== "GET" ? JSON.stringify(params) : undefined,

    // Params will only be populated with data if the request method is GET.
    params: method === "GET" ? JSON.stringify(params) : undefined,
  }).catch((err) => {
    console.error(
      `Could not fetch data from ${url} with params ${JSON.stringify(
        params
      )}: ${err}`
    );
    return null;
  });

  const data = !fetchResponse
    ? undefined
    : await fetchResponse.json().catch((err) => {
        console.error(`Error parsing JSON response from ${url}: ${err}`);
        return null;
      });

  // Add a 200 status code to responses that are successful but have no status code.
  if (fetchResponse && Object.keys(data).length > 0) {
    data.statusCode = fetchResponse.status;
  }

  return data;
};

export const convertToCamelCase = (str) => {
  // Convert the field name into camelCase
  const strParts = str.split(" ");
  strParts.forEach((part, i) => {
    if (i === 0) {
      strParts[i] = part.toLowerCase();
    } else {
      strParts[i] = part.charAt(0).toUpperCase() + part.slice(1);
    }
  });
  return strParts.join('');
};
