// validate-password-reset-token.service.test.js
import { describe, it, expect, beforeEach, vi } from "vitest"
import { validatePasswordResetToken } from "./validate-token.service.js"
import { findUserBy } from "../../user/user.repository.js"
import UnauthorizedError from "../../../errors/UnauthorizedError.js"

vi.mock("../../user/user.repository.js")

describe("validatePasswordResetToken", () => {
  const validToken = "valid-token"
  const expiredToken = "expired-token"
  const invalidToken = "invalid-token"

  beforeEach(() => {
    vi.clearAllMocks() // Clear mocks before each test
  })

  it("should return an UnauthorizedError if the token is invalid", async () => {
    findUserBy.mockResolvedValue(null) // Simulate no user found with the reset token

    const result = await validatePasswordResetToken(invalidToken)
    expect(result).toBeInstanceOf(UnauthorizedError)
    expect(result.message).toBe(
      "The password reset token is invalid. Please request a new token."
    )
  })

  it("should return an UnauthorizedError if the token is expired", async () => {
    const mockUser = {
      passwordResetTokenExpiration: new Date(Date.now() - 1000), // Set an expired token expiration date
    }
    findUserBy.mockResolvedValue(mockUser) // Simulate user found with the expired token

    const result = await validatePasswordResetToken(expiredToken)
    expect(result).toBeInstanceOf(UnauthorizedError)
    expect(result.message).toBe(
      "The password reset token has expired. Please request a new token."
    )
  })

  it("should return true if the token is valid and not expired", async () => {
    const mockUser = {
      passwordResetTokenExpiration: new Date(Date.now() + 1000 * 60), // Set a valid token expiration date (1 minute in the future)
    }
    findUserBy.mockResolvedValue(mockUser) // Simulate user found with the valid token

    const result = await validatePasswordResetToken(validToken)
    expect(result).toBe(true)
  })
})
