import { describe, it, expect, beforeEach, vi } from "vitest"
import { validatePasswordResetToken } from "./validate-token.service.js"
import { findUserBy } from "../../user/user.repository.js"
import UnauthorizedError from "../../../errors/UnauthorizedError.js"

// Mock the user repository
vi.mock("../../user/user.repository.js")

describe("validatePasswordResetToken", () => {
  // Define mock tokens for testing different scenarios
  const validToken = "valid-token"
  const expiredToken = "expired-token"
  const invalidToken = "invalid-token"

  // Reset mocks before each test case
  beforeEach(() => {
    vi.clearAllMocks()
  })

  // Test case: Should return an UnauthorizedError if the token is invalid
  it("should return an UnauthorizedError if the token is invalid", async () => {
    // Simulate no user found with the provided invalid reset token
    findUserBy.mockResolvedValue(null)

    const result = await validatePasswordResetToken(invalidToken)
    expect(result).toBeInstanceOf(UnauthorizedError)
    expect(result.message).toBe(
      "The password reset token is invalid. Please request a new token."
    )
  })

  // Test case: Should return an UnauthorizedError if the token is expired
  it("should return an UnauthorizedError if the token is expired", async () => {
    // Simulate user found but the token has expired
    const mockUser = {
      passwordResetTokenExpiration: new Date(Date.now() - 1000), // Expired token (1 second in the past)
    }
    findUserBy.mockResolvedValue(mockUser)

    const result = await validatePasswordResetToken(expiredToken)
    expect(result).toBeInstanceOf(UnauthorizedError)
    expect(result.message).toBe(
      "The password reset token has expired. Please request a new token."
    )
  })

  // Test case: Should return true if the token is valid and not expired
  it("should return true if the token is valid and not expired", async () => {
    // Simulate user found with a valid token that hasn't expired
    const mockUser = {
      passwordResetTokenExpiration: new Date(Date.now() + 1000 * 60), // Valid token (1 minute in the future)
    }
    findUserBy.mockResolvedValue(mockUser)

    const result = await validatePasswordResetToken(validToken)
    expect(result).toBe(true)
  })
})
