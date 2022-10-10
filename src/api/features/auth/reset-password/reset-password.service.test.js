import { describe, it, expect, beforeEach, vi } from "vitest"
import { resetPassword } from "./reset-password.service.js"
import { findUserBy } from "../../user/user.repository.js"
import { generateSalt, hashPassword } from "../authentication.service.js"
import UnauthorizedError from "../../../errors/UnauthorizedError.js"
import ValidationError from "../../../errors/ValidationError.js"

// Mock the user repository and authentication service
vi.mock("../../user/user.repository.js")
vi.mock("../authentication.service.js")

describe("resetPassword", () => {
  // Define test constants
  const newPassword = "newSecurePassword123"
  const invalidPassword = "short"
  const passwordResetToken = "valid-reset-token"

  // Clear mocks before each test case
  beforeEach(() => {
    vi.clearAllMocks()
  })

  // Test case: Should return a ValidationError if the new password is too short
  it("should return a ValidationError if the new password is too short", async () => {
    const result = await resetPassword(invalidPassword, passwordResetToken)
    expect(result).toBeInstanceOf(ValidationError)
    expect(result.message).toBe(
      "New password must be at least 8 characters long."
    )
  })

  // Test case: Should return an UnauthorizedError if the password reset token is invalid
  it("should return an UnauthorizedError if the password reset token is invalid", async () => {
    findUserBy.mockResolvedValue(null) // Simulate no user found with the reset token

    const result = await resetPassword(newPassword, passwordResetToken)
    expect(result).toBeInstanceOf(UnauthorizedError)
    expect(result.message).toBe("The password reset token is invalid.")
  })

  // Test case: Should successfully reset the password and return a success message
  it("should successfully reset the password and return a success message", async () => {
    // Mock user object with a save method
    const mockUser = {
      save: vi.fn().mockResolvedValue(true), // Simulate successful save
    }
    findUserBy.mockResolvedValue(mockUser) // Simulate user found with the reset token

    const mockSalt = "mocked-salt"
    generateSalt.mockReturnValue(mockSalt) // Mock salt generation
    const newPasswordHash = mockSalt + hashPassword(newPassword, mockSalt) // Create expected hashed password

    const result = await resetPassword(newPassword, passwordResetToken)
    expect(result).toEqual({ message: "Password reset successfully." })
    expect(mockUser.save).toHaveBeenCalledWith({
      hash: newPasswordHash,
      passwordResetToken: null,
      passwordResetTokenExpiration: null,
    })
  })
})
