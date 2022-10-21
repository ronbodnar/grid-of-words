import { afterEach, describe, expect, it, vi } from "vitest"
import { abandonGameById } from "./abandon.service.js"
import { findGameById } from "../game.repository.js"
import { getAuthenticatedUser } from "../../auth/authentication.service.js"
import { updateStats } from "../../user/statistics/statistics.service.js"
import GameState from "../GameState.js"
import { ObjectId } from "mongodb"
import InternalError from "../../../errors/InternalError.js"
import NotFoundError from "../../../errors/NotFoundError.js"

// Mock dependencies
vi.mock("../game.repository.js")
vi.mock("../../auth/authentication.service.js")
vi.mock("../../user/statistics/statistics.service.js")

describe("abandonGameById", () => {
  const mockGameId = new ObjectId()
  const mockToken = "mock-auth-token"
  const mockUserId = new ObjectId()
  const mockGame = {
    _id: mockGameId,
    ownerId: mockUserId,
    save: vi.fn(),
  }

  afterEach(() => {
    vi.restoreAllMocks() // Reset mocks after each test
  })

  // Test case: Return NotFoundError if no game is found
  it("returns NotFoundError for nonexistent gameId", async () => {
    findGameById.mockResolvedValue(null)

    const result = await abandonGameById(mockGameId, mockToken)

    expect(result).toBeInstanceOf(NotFoundError)
    expect(result.message).toBe("No game found for abandon request")
  })

  // Test case: Update user statistics if the authenticated user matches the game's owner
  it("updates user statistics for owner", async () => {
    findGameById.mockResolvedValue(mockGame)
    getAuthenticatedUser.mockResolvedValue({ _id: mockUserId })
    updateStats.mockResolvedValue(true)
    mockGame.save.mockResolvedValue(true)

    const result = await abandonGameById(mockGameId, mockToken)

    expect(updateStats).toHaveBeenCalledWith(
      { _id: mockUserId }, // Pass the user ID as an object
      -1,
      GameState.ABANDONED
    )
    expect(result).toEqual({})
  })

  // Test case: Do not update stats if authenticated user is not the owner
  it("does not update stats for non-owner", async () => {
    const differentUserId = new ObjectId()
    findGameById.mockResolvedValue(mockGame)
    getAuthenticatedUser.mockResolvedValue({ _id: differentUserId })

    const result = await abandonGameById(mockGameId, mockToken)

    expect(updateStats).not.toHaveBeenCalled()
    expect(result).toBeUndefined()
  })

  // Test case: Return InternalError if stats update fails
  it("returns InternalError when stats update fails", async () => {
    findGameById.mockResolvedValue(mockGame)
    getAuthenticatedUser.mockResolvedValue({ _id: mockUserId })
    updateStats.mockResolvedValue(false)

    const result = await abandonGameById(mockGameId, mockToken)

    expect(result).toBeInstanceOf(InternalError)
    expect(result.message).toBe(
      "Failed to update user stats after game abandonment."
    )
  })

  // Test case: Return InternalError if saving the game fails
  it("returns InternalError if game save fails", async () => {
    findGameById.mockResolvedValue(mockGame)
    getAuthenticatedUser.mockResolvedValue({ _id: mockUserId })
    updateStats.mockResolvedValue(true)
    mockGame.save.mockResolvedValue(false)

    const result = await abandonGameById(mockGameId, mockToken)

    expect(result).toBeInstanceOf(InternalError)
    expect(result.message).toBe("Failed to save game to the database")
  })
})
