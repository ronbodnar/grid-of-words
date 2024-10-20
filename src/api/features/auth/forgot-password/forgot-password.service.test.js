// forgot-password.service.test.js
import { describe, it, expect, beforeEach, vi } from "vitest"
import { forgotPassword } from "./forgot-password.service.js"
import { findUserBy } from "../../user/user.repository.js"
import { generateSalt } from "../authentication.service.js"
import { sendPasswordResetEmail } from "../../email/email.service.js"
import ValidationError from "../../../errors/ValidationError.js"

// Mock dependencies
vi.mock("../../user/user.repository.js")
vi.mock("../authentication.service.js")
vi.mock("../../email/email.service.js")
vi.mock("../../../config/winston.config.js") // Mock logger if necessary

describe("forgotPassword", () => {
  const email = "test@example.com"

  // Reset mocks before each test
  beforeEach(() => {
    vi.clearAllMocks()
  })

  // Test case: Validate that an invalid email format returns a ValidationError
  it("returns a ValidationError for invalid email format", async () => {
    const invalidEmail = "invalid-email"
    const result = await forgotPassword(invalidEmail)

    expect(result).toBeInstanceOf(ValidationError)
    expect(result.message).toBe(
      "The email address is not a valid email format."
    )
  })

  // Test case: Confirm that no user is found when the email doesn't match
  it("confirms no user found when email doesn't match", async () => {
    findUserBy.mockResolvedValue(null)

    const result = await forgotPassword(email)

    expect(result).toEqual({
      statusCode: 200,
      message:
        "If the email matches an account, a password reset link will be sent with next steps.",
    })
    expect(findUserBy).toHaveBeenCalledWith("email", email)
  })

  // Test case: Save user with reset token and send email if user exists
  it("saves user with reset token and sends email if user exists", async () => {
    const mockUser = { save: vi.fn().mockResolvedValue(true) }
    findUserBy.mockResolvedValue(mockUser)
    const token = "mocked-token"
    generateSalt.mockReturnValue(token)
    sendPasswordResetEmail.mockResolvedValue(true)

    const result = await forgotPassword(email)

    expect(generateSalt).toHaveBeenCalledWith(32)
    expect(mockUser.save).toHaveBeenCalledWith({
      passwordResetToken: token,
      passwordResetTokenExpiration: expect.any(Date),
    })
    expect(sendPasswordResetEmail).toHaveBeenCalledWith(mockUser, token)
    expect(result).toEqual({
      statusCode: 200,
      message:
        "If the email matches an account, a password reset link will be sent with next steps.",
    })
  })

  // Test case: Return success message if user save fails
  it("returns success if user save fails", async () => {
    const mockUser = { save: vi.fn().mockResolvedValue(false) }
    findUserBy.mockResolvedValue(mockUser)

    const result = await forgotPassword(email)

    expect(result).toEqual({
      statusCode: 200,
      message:
        "If the email matches an account, a password reset link will be sent with next steps.",
    })
  })

  // Test case: Return success message if sending email fails
  it("returns success if sending email fails", async () => {
    const mockUser = { save: vi.fn().mockResolvedValue(true) }
    findUserBy.mockResolvedValue(mockUser)
    const token = "mocked-token"
    generateSalt.mockReturnValue(token)
    sendPasswordResetEmail.mockResolvedValue(false)

    const result = await forgotPassword(email)

    expect(result).toEqual({
      statusCode: 200,
      message:
        "If the email matches an account, a password reset link will be sent with next steps.",
    })
  })
})
