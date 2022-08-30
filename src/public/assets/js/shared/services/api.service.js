import { getAuthenticatedUser } from "../../features/auth/authentication.service.js";
import { logger } from "../../main.js";
import { retrieveLocal, storeLocal } from "./storage.service.js";

/**
 * Fetches and parses data using the fetch API and injects the statusCode into the response object.
 *
 * @param {string} url The URL to fetch data from.
 * @param {string} [method='GET'] - (optional) - The request method to use with the fetch request.
 * @param {Object} [params={}] - (optional) - An object of key/values to pass in the query (GET) or body (POST, PUT, etc) parameters.
 * @returns {Promise<any>} A promise that resolves to an object containing the parsed response data, or `null` if an error occurs or no data is fetched.
 */
export const fetchData = async (
  url,
  method = "GET",
  params = {},
  timeoutDelay = 15000
) => {
  // Set up the abort controller signal for timeout handling.
  const controller = new AbortController();
  const { signal } = controller;

  const timeout = setTimeout(() => {
    controller.abort();
  }, timeoutDelay);

  // Allowed fetch methods
  const allowedMethods = ["GET", "POST", "PUT", "PATCH", "DELETE"];

  // Verify that the method is allowed.
  if (!allowedMethods.includes(method)) {
    throw new Error(
      `Invalid method: ${method}. Only ${allowedMethods.join(
        ", "
      )} are allowed.`
    );
  }

  try {
    // Inject the query parameters into the url if the request is a GET request.
    const encodedParams = new URLSearchParams(params);
    if (method === "GET" && encodedParams.size > 0) {
      url = `${url}?${encodedParams.toString()}`;
    }

    const options = {
      headers: {
        "Content-Type": "application/json",
      },
      method: method,
      body: method !== "GET" ? JSON.stringify(params) : undefined,
      signal: signal,
    };
    const fetchResponse = await fetch(url, options);

    clearTimeout(timeout);

    const data = !fetchResponse
      ? {}
      : await fetchResponse.json().catch((err) => {
          logger.error(`Error parsing JSON response from ${url}: ${err}`);
          return {};
        });

    if (fetchResponse && !data?.statusCode) {
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

export const loadStatistics = async () => {
  const authenticatedUser = getAuthenticatedUser();
  if (!authenticatedUser) {
    return null;
  }
  const statisticsResult = await fetchData(`/statistics`);
  console.log("Statistics result", statisticsResult)
  return statisticsResult;
}

/**
 * Fetches a list of words from the server with a specified length range.
 *
 * @param {number} minLength - The minimum length of words to fetch. Defaults to MINIMUM_WORD_LENGTH.
 * @param {number} maxLength - The maximum length of words to fetch. Defaults to MAXIMUM_WORD_LENGTH.
 * @returns {Promise<Array>} A promise that resolves to an array of words.
 */
export const fetchWordList = async (length) => {
  if (!length) {
    throw new Error("Word length is required");
  }
  // The word list is of form: { <length>: [...words], ... }
  const localWordList = retrieveLocal("wordList") || {};
  if (Object.hasOwn(localWordList, length)) {
    return;
  }
  return fetchData(`word/list`, "GET", {
    length: length,
  })
    .then((response) => {
      localWordList[length] = response;
      storeLocal("wordList", localWordList);
      logger.info(
        `Stored ${response.length} ${length} letter words in local storage.`
      );
    })
    .catch((error) => logger.error("Error fetching word list", error));
};

/**
 * Checks if a given word exists in the word list stored in local storage.
 *
 * @param {string} word - The word to check.
 * @returns {boolean} True if the word exists in the word list, false otherwise.
 */
export const wordExists = (word) => {
  const wordLen = word.length;
  const wordList = retrieveLocal("wordList");
  // We can fetch the word list in the background and safely pass validation off to the server.
  if (!wordList || !Object.hasOwn(wordList, wordLen)) {
    fetchWordList(wordLen);
    return true;
  }
  return wordList[wordLen].includes(word);
};
