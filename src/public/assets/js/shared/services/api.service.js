import { logger } from "../../main.js"
import { retrieveLocal, storeLocal } from "./storage.service.js"

/**
 * Fetches and parses data using the fetch API and injects the statusCode into the response object.
 *
 * @async
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
  const controller = new AbortController()
  const { signal } = controller

  const timeout = setTimeout(() => {
    controller.abort()
  }, timeoutDelay)

  // Allowed fetch methods
  const allowedMethods = ["GET", "POST", "PUT", "PATCH", "DELETE"]

  // Verify that the method is allowed.
  if (!allowedMethods.includes(method)) {
    throw new Error(
      `Invalid method: ${method}. Only ${allowedMethods.join(
        ", "
      )} are allowed.`
    )
  }

  try {
    // Inject the query parameters into the url if the request is a GET request.
    const encodedParams = new URLSearchParams(params)
    if (method === "GET" && encodedParams.size > 0) {
      url = `${url}?${encodedParams.toString()}`
    }

    const options = {
      headers: {
        "Content-Type": "application/json",
      },
      method: method,
      body: method !== "GET" ? JSON.stringify(params) : undefined,
      signal: signal,
    }
    const fetchResponse = await fetch(url, options)

    // Clear the timeout for aborting after 15 seconds if the fetch was successful.
    clearTimeout(timeout)

    const data = !fetchResponse
      ? {}
      : await fetchResponse.json().catch((err) => {
          logger.error(`Error parsing JSON response from ${url}: ${err}`)
          return {}
        })

    // Reformat the response data object to separate the payload and the status code.
    if (fetchResponse) {
      const dataCopy = structuredClone(data)
      const statusCode = data?.statusCode || fetchResponse.status

      Object.keys(data).forEach((key) => delete data[key])

      data.payload = dataCopy
      data.statusCode = statusCode
    }

    return data
  } catch (err) {
    if (err.name === "AbortError") {
      logger.error(`Request to ${url} timed out.`)
    } else {
      logger.error("Failed to fetch data", {
        url: url,
        params: params,
        error: err,
      })
    }
    return null
  }
}

/**
 * Fetches a list of words from the server with a specified length range.
 *
 * @async
 * @param {number} minLength - The minimum length of words to fetch. Defaults to MINIMUM_WORD_LENGTH.
 * @param {number} maxLength - The maximum length of words to fetch. Defaults to MAXIMUM_WORD_LENGTH.
 * @returns {Promise<Array>} A promise that resolves to an array of words.
 */
export const fetchWordList = async (length, language) => {
  if (!length || !language) {
    throw new Error("Required parameters: length, language")
  }
  const storageKey = `wordList.${language}`
  // The word list is of form: { <language>: { <length-1>: [...words], <length-2>: ... }, ... }
  const localWordList = retrieveLocal(storageKey) || {}
  if (Object.hasOwn(localWordList, length)) {
    return
  }
  return fetchData(`word/list`, "GET", {
    length: length,
    language: language,
  })
    .then((response) => {
      const data = response.payload
      if (!data) {
        logger.error("No data received from word list endpoint.")
        return
      }
      localWordList[length] = data
      storeLocal(storageKey, localWordList)
      logger.info(
        `Stored ${data.length} ${length} letter ${language} words in local storage.`
      )
    })
    .catch((error) => logger.error("Error fetching word list", error))
}

/**
 * Checks if a given word exists in the word list stored in local storage.
 *
 * @param {string} word - The word to check.
 * @returns {boolean} True if the word exists in the word list, false otherwise.
 */
export const wordExists = (word, language) => {
  const wordLen = word.length
  const wordList = retrieveLocal(`wordList.${language}`)
  // We can fetch the word list in the background and safely pass validation off to the server.
  if (!wordList || !Object.hasOwn(wordList, wordLen)) {
    fetchWordList(wordLen, language)
    return true
  }
  return wordList[wordLen].includes(word)
}
