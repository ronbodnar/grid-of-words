import { describe, it, expect, vi } from "vitest"
import { addAttempt } from "./attempt.service.js"
import { findGameById } from "../game.repository.js"
import { getAuthenticatedUser } from "../../auth/authentication.service.js"
import { updateStats } from "../../user/statistics/statistics.service.js"
import { exists } from "../../word/word.repository.js"
import UnauthorizedError from "../../../errors/UnauthorizedError.js"
import ValidationError from "../../../errors/ValidationError.js"
import NotFoundError from "../../../errors/NotFoundError.js"
import InternalError from "../../../errors/InternalError.js"
import GameState from "../GameState.js"

// Mock the dependencies
vi.mock("../game.repository.js")
vi.mock("../../auth/authentication.service.js")
vi.mock("../../user/statistics/statistics.service.js")
vi.mock("../../word/word.repository.js")

describe("addAttempt", () => {
  // Setting up common mock variables for tests
  const mockAuthToken = "authToken123"
  const mockGameId = "game123"
  const mockGame = {
    _id: mockGameId,
    word: "apple",
    attempts: [],
    maxAttempts: 6,
    save: vi.fn().mockResolvedValue(true), // Mocked game save function
  }
  const mockUser = { _id: "user123" }

  // Test case: when the game is not found in the repository
  it("should return NotFoundError if game is not found", async () => {
    findGameById.mockResolvedValue(null)

    const result = await addAttempt("apple", mockGameId, mockAuthToken)

    expect(result).toBeInstanceOf(NotFoundError)
    expect(result.message).toBe("GAME_NOT_FOUND")
  })

  // Test case: when the authenticated user is not the owner of the game
  it("should return UnauthorizedError if the authenticated user is not the game owner", async () => {
    findGameById.mockResolvedValue({ ...mockGame, ownerId: "user456" })
    getAuthenticatedUser.mockResolvedValue(mockUser)

    const result = await addAttempt("apple", mockGameId, mockAuthToken)

    expect(result).toBeInstanceOf(UnauthorizedError)
    expect(result.message).toBe("NOT_AUTHORIZED")
  })

  // Test case: when the maximum number of attempts has already been reached
  it("should return ValidationError if max attempts are exceeded", async () => {
    const gameWithMaxAttempts = {
      ...mockGame,
      attempts: ["guess1", "guess2", "guess3", "guess4", "guess5", "guess6"],
    }
    findGameById.mockResolvedValue(gameWithMaxAttempts)
    getAuthenticatedUser.mockResolvedValue(mockUser)

    const result = await addAttempt("apple", mockGameId, mockAuthToken)

    expect(result).toBeInstanceOf(ValidationError)
    expect(result.message).toBe("ATTEMPTS_EXCEEDED")
  })

  // Test case: when the word length does not match the expected length of the correct word
  it("should return with WORD_LENGTH_MISMATCH if the word length does not match", async () => {
    findGameById.mockResolvedValue(mockGame)
    getAuthenticatedUser.mockResolvedValue(mockUser)
    exists.mockResolvedValue(true) // Word exists in the repository

    const result = await addAttempt("toolong", mockGameId, mockAuthToken)

    expect(result.message).toBe("WORD_LENGTH_MISMATCH")
  })

  // Test case: when the attempted word is not found in the word list
  it("should return with NOT_IN_WORD_LIST if the word is not in the word list", async () => {
    findGameById.mockResolvedValue(mockGame)
    getAuthenticatedUser.mockResolvedValue(mockUser)
    exists.mockResolvedValue(false) // Word doesn't exist

    const result = await addAttempt("blank", mockGameId, mockAuthToken)

    expect(result.message).toBe("NOT_IN_WORD_LIST")
  })

  // Test case: when a duplicate word is attempted
  it("should return ValidationError when a duplicate attempt is made", async () => {
    const winningGame = { ...mockGame, attempts: ["train"] }
    findGameById.mockResolvedValue(winningGame)
    getAuthenticatedUser.mockResolvedValue(mockUser)
    exists.mockResolvedValue(true) // Word exists
    updateStats.mockResolvedValue(true)

    const result = await addAttempt("train", mockGameId, mockAuthToken)

    expect(result.message).toBe("DUPLICATE_ATTEMPT")
    expect(winningGame.attempts).toContain("train")
  })

  // Test case: when the user correctly guesses the word and wins the game
  it("should return correct game state and update stats when the user wins", async () => {
    const winningGame = { ...mockGame }
    findGameById.mockResolvedValue(winningGame)
    getAuthenticatedUser.mockResolvedValue(mockUser)
    exists.mockResolvedValue(true) // Word exists

    const result = await addAttempt("apple", mockGameId, mockAuthToken)

    expect(result.message).toBe("WINNER")
    expect(winningGame.state).toBe(GameState.WINNER)
    expect(winningGame.endTime).toBeDefined()
    expect(winningGame.attempts).toContain("apple")
    expect(updateStats).toHaveBeenCalledWith(mockUser, 1, GameState.WINNER)
  })

  // Test case: when the user uses all attempts but doesn't guess correctly (loses the game)
  it("should return correct game state and update stats when the user loses", async () => {
    const losingGame = {
      ...mockGame,
      attempts: ["guess1", "guess2", "guess3", "guess4", "guess5"],
    }
    findGameById.mockResolvedValue(losingGame)
    getAuthenticatedUser.mockResolvedValue(mockUser)
    exists.mockResolvedValue(true) // Word exists
    updateStats.mockResolvedValue(true)

    const result = await addAttempt("wrong", mockGameId, mockAuthToken)

    expect(result.message).toBe("LOSER")
    expect(losingGame.state).toBe(GameState.LOSER)
    expect(losingGame.endTime).toBeDefined()
    expect(losingGame.attempts).toContain("wrong")
    expect(updateStats).toHaveBeenCalledWith(mockUser, 6, GameState.LOSER)
  })

  // Test case: when updating user statistics fails after game completion
  it("should return InternalError if user stats fail to update", async () => {
    const failingGame = {
      ...mockGame,
      attempts: ["guess1", "guess2", "guess3", "guess4", "guess5"],
      save: vi.fn().mockResolvedValue(false),
    }
    findGameById.mockResolvedValue(failingGame)
    getAuthenticatedUser.mockResolvedValue(mockUser)
    exists.mockResolvedValue(true) // Word exists
    updateStats.mockResolvedValue(false) // Simulate unsuccessful stats update

    const result = await addAttempt("train", mockGameId, mockAuthToken)

    expect(result).toBeInstanceOf(InternalError)
    expect(result.message).toBe(
      "Failed to update user stats after game completion."
    )
  })

  // Test case: when the game fails to save after an attempt is made
  it("should return InternalError if the game fails to save", async () => {
    const failingGame = {
      ...mockGame,
      attempts: ["guess1", "guess2", "guess3", "guess4", "guess5"],
      save: vi.fn().mockResolvedValue(false),
    }
    findGameById.mockResolvedValue(failingGame)
    getAuthenticatedUser.mockResolvedValue(mockUser)
    exists.mockResolvedValue(true)
    updateStats.mockResolvedValue(true)

    const result = await addAttempt("train", mockGameId, mockAuthToken)

    expect(result).toBeInstanceOf(InternalError)
    expect(result.message).toBe(
      "Failed to save game to database after attempt."
    )
  })

  // Test case: when an incorrect word is guessed but the game is still in progress
  it("should return 'WRONG_WORD' for incorrect attempts when game is in progress", async () => {
    findGameById.mockResolvedValue(mockGame)
    getAuthenticatedUser.mockResolvedValue(mockUser)
    exists.mockResolvedValue(true)

    const result = await addAttempt("wrong", mockGameId, mockAuthToken)

    expect(result.message).toBe("WRONG_WORD")
    expect(mockGame.attempts).toContain("wrong")
  })
})
