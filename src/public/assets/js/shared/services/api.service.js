import { logger } from "../../main.js";
import {
  MAXIMUM_WORD_LENGTH,
  MINIMUM_WORD_LENGTH,
} from "../utils/constants.js";
import { retrieveLocal } from "./storage.service.js";

/**
 * Fetches and parses data using the fetch API and injects the statusCode into the response object.
 *
 * @param {string} url The URL to fetch data from.
 * @param {string} [method='GET'] - (optional) - The request method to use with the fetch request.
 * @param {Object} [params={}] - (optional) - An object of key/values to pass in the query (GET) or body (POST, PUT, etc) parameters.
 * @returns {Promise<any>} A promise that resolves to an object containing the parsed response data, or `null` if an error occurs or no data is fetched.
 */
export const fetchData = async (url, method, params, timeoutDelay = 15000) => {
  // Set up the abort controller signal for timeout handling.
  const controller = new AbortController();
  const { signal } = controller;

  const timeout = setTimeout(() => {
    controller.abort();
  }, timeoutDelay);

  // Allowed fetch methods
  const allowedMethods = ["GET", "POST", "PUT", "PATCH", "DELETE"];

  // Set up default values
  method = method || "GET";
  params = params || {};

  // Verify that the method is allowed.
  if (!allowedMethods.includes(method)) {
    throw new Error(
      `Invalid method: ${method}. Only ${allowedMethods.join(
        ", "
      )} are allowed.`
    );
  }

  try {
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
      signal: signal,
    });

    clearTimeout(timeout);

    const data = !fetchResponse
      ? undefined
      : await fetchResponse.json().catch((err) => {
          logger.error(`Error parsing JSON response from ${url}: ${err}`);
          return null;
        });

    if (fetchResponse && data.statusCode !== fetchResponse.status) {
      data.statusCode = fetchResponse.status;
    }

    return data;
  } catch (err) {
    if (err.name === "AbortError") {
      logger.error(`Request to ${url} timed out.`);
    } else {
      logger.error("Failed to fetch data", {
        url: url,
        params: params,
        error: err,
      });
    }
    return null;
  }
};

/**
 * Fetches a list of words from the server with a specified length range.
 *
 * @param {number} minLength - The minimum length of words to fetch. Defaults to MINIMUM_WORD_LENGTH.
 * @param {number} maxLength - The maximum length of words to fetch. Defaults to MAXIMUM_WORD_LENGTH.
 * @returns {Promise<Array>} A promise that resolves to an array of words.
 */
export const fetchWordList = async (length) => {
  return fetchData(`word/list`, "GET", {
    length: length,
  });
};

/**
 * Checks if a given word exists in the word list stored in local storage.
 *
 * @param {string} word - The word to check.
 * @returns {boolean} True if the word exists in the word list, false otherwise.
 */
export const wordExists = (word) => {
  const wordList = retrieveLocal("wordList");
  if (!wordList || !Array.isArray(wordList)) return true;
  return wordList.includes(word);
};
