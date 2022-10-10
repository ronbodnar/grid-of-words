import { describe, it, expect, vi } from "vitest"
import { getGameById } from "./game.service.js" // Adjust the path based on your file structure
import { findGameById } from "./game.repository.js"
import NotFoundError from "../../errors/NotFoundError.js"

vi.mock("./game.repository.js")

describe("getGameById", () => {
  it("should return the game if found", async () => {
    const mockGame = { _id: "123", word: "example", state: "IN PROGRESS" }
    findGameById.mockResolvedValue(mockGame)

    const result = await getGameById("123")

    expect(result).toEqual(mockGame)
    expect(findGameById).toHaveBeenCalledWith("123")
  })

  it("should return a NotFoundError if the game is not found", async () => {
    findGameById.mockResolvedValue(null)

    const result = await getGameById("nonexistent")

    expect(result).toBeInstanceOf(NotFoundError)
    expect(result.message).toBe("No game found for the provided id")
    expect(result.data).toEqual(JSON.stringify({ gameId: "nonexistent" }))
    expect(findGameById).toHaveBeenCalledWith("nonexistent")
  })
})
