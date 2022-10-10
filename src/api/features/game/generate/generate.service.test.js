import { describe, it, expect, vi } from "vitest"
import { generateNewGame } from "./generate.service.js"
import { findWordByLength } from "../../word/word.repository.js"
import { insertGame, findGameById } from "../game.repository.js"
import ValidationError from "../../../errors/ValidationError.js"
import InternalError from "../../../errors/InternalError.js"
import NotFoundError from "../../../errors/NotFoundError.js"
import UnauthorizedError from "../../../errors/UnauthorizedError.js"

// Mock the dependencies
vi.mock("../../word/word.repository.js")
vi.mock("../game.repository.js")

describe("generateNewGame", () => {
  // Define a mock authenticated user for use in the tests
  const mockAuthenticatedUser = { _id: "user123" }

  // Test case: Return ValidationError if required parameters are missing
  it("should return ValidationError if required parameters are missing", async () => {
    const result = await generateNewGame(null, 5, 6, mockAuthenticatedUser)

    expect(result).toBeInstanceOf(ValidationError)
    expect(result.message).toBe(
      "Required parameters: language, wordLength, maxAttempts"
    )
  })

  // Test case: Return UnauthorizedError if the authenticated user is null
  it("should return UnauthorizedError if the authenticatedUser is null", async () => {
    const result = await generateNewGame("english", 5, 6, null)

    expect(result).toBeInstanceOf(UnauthorizedError)
    expect(result.message).toBe("User session expired. Please log in again.")
  })

  // Test case: Return ValidationError for an invalid language
  it("should return ValidationError for invalid language", async () => {
    const result = await generateNewGame("german", 5, 6, mockAuthenticatedUser)

    expect(result).toBeInstanceOf(ValidationError)
    expect(result.message).toBe("Invalid language")
    expect(JSON.parse(result.data)).toEqual({ language: "german" })
  })

  // Test case: Return ValidationError for an invalid word length
  it("should return ValidationError for invalid word length", async () => {
    const result = await generateNewGame(
      "english",
      50,
      6,
      mockAuthenticatedUser
    )

    expect(result).toBeInstanceOf(ValidationError)
    expect(result.message).toBe("Invalid word length")
    expect(JSON.parse(result.data)).toEqual({ wordLength: 50 })
  })

  // Test case: Return ValidationError for an invalid maxAttempts value
  it("should return ValidationError for invalid maxAttempts", async () => {
    const result = await generateNewGame(
      "english",
      5,
      20,
      mockAuthenticatedUser
    )

    expect(result).toBeInstanceOf(ValidationError)
    expect(result.message).toBe("Invalid max attempts")
    expect(JSON.parse(result.data)).toEqual({ maxAttempts: 20 })
  })

  // Test case: Return InternalError if no word is found for the given length
  it("should return InternalError if no word is found", async () => {
    findWordByLength.mockResolvedValue(null)

    const result = await generateNewGame("english", 5, 6, mockAuthenticatedUser)

    expect(result).toBeInstanceOf(InternalError)
    expect(result.message).toBe(
      "Failed to obtain a random word when creating a new game"
    )
    expect(JSON.parse(result.data)).toEqual({ wordLength: 5 })
  })

  // Test case: Return InternalError if game insertion fails in the database
  it("should return InternalError if game insertion fails", async () => {
    findWordByLength.mockResolvedValue("apple")
    insertGame.mockResolvedValue(null) // Simulate a failure in inserting the game

    const result = await generateNewGame("english", 5, 6, mockAuthenticatedUser)

    expect(result).toBeInstanceOf(InternalError)
    expect(result.message).toBe("Failed to insert new game into the database")
  })

  // Test case: Return NotFoundError if the inserted game is not found afterward
  it("should return NotFoundError if the created game is not found", async () => {
    findWordByLength.mockResolvedValue("apple")
    insertGame.mockResolvedValue("game123")
    findGameById.mockResolvedValue(null) // Simulate failure to find the created game

    const result = await generateNewGame("english", 5, 6, mockAuthenticatedUser)

    expect(result).toBeInstanceOf(NotFoundError)
    expect(result.message).toBe("Failed to find the newly created game")
    expect(JSON.parse(result.data)).toEqual({ gameId: "game123" })
  })

  // Test case: Return the created game object if the game is successfully created
  it("should return the created game on success", async () => {
    const mockGame = { _id: "game123", word: "apple" }
    findWordByLength.mockResolvedValue("apple")
    insertGame.mockResolvedValue("game123")
    findGameById.mockResolvedValue(mockGame)

    const result = await generateNewGame("english", 5, 6, mockAuthenticatedUser)

    expect(result).toEqual(mockGame)
    expect(findWordByLength).toHaveBeenCalledWith(5, "english")
    expect(insertGame).toHaveBeenCalled()
    expect(findGameById).toHaveBeenCalledWith("game123")
  })
})
