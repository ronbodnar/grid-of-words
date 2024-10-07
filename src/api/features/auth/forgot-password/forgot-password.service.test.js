// forgot-password.service.test.js
import { describe, it, expect, beforeEach, vi } from "vitest"
import { forgotPassword } from "./forgot-password.service.js"
import { findUserBy } from "../../user/user.repository.js"
import { generateSalt } from "../authentication.service.js"
import { sendPasswordResetEmail } from "../../email/email.service.js"
import ValidationError from "../../../errors/ValidationError.js"

vi.mock("../../user/user.repository.js")
vi.mock("../authentication.service.js")
vi.mock("../../email/email.service.js")
vi.mock("../../../config/winston.config.js") // Mock logger if necessary

describe("forgotPassword", () => {
  const email = "test@example.com"

  beforeEach(() => {
    vi.clearAllMocks() // Clear mocks before each test
  })

  it("should return a validation error for an invalid email format", async () => {
    const invalidEmail = "invalid-email"
    const result = await forgotPassword(invalidEmail)

    expect(result).toBeInstanceOf(ValidationError)
    expect(result.message).toBe(
      "The email address is not a valid email format."
    )
  })

  it("should return success message if the email does not belong to a user", async () => {
    findUserBy.mockResolvedValue(null) // Simulate no user found

    const result = await forgotPassword(email)

    expect(result).toEqual({
      statusCode: 200,
      message:
        "If the email matches an account, a password reset link will be sent with next steps.",
    })
    expect(findUserBy).toHaveBeenCalledWith("email", email)
  })

  it("should save user with reset token and send email if user is found", async () => {
    const mockUser = { save: vi.fn().mockResolvedValue(true) } // Mock user object with save method
    findUserBy.mockResolvedValue(mockUser) // Simulate user found
    const token = "mocked-token"
    generateSalt.mockReturnValue(token) // Mock token generation

    sendPasswordResetEmail.mockResolvedValue(true) // Simulate successful email sending

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

  it("should return success message if saving user fails", async () => {
    const mockUser = { save: vi.fn().mockResolvedValue(false) } // Simulate save failure
    findUserBy.mockResolvedValue(mockUser) // Simulate user found

    const result = await forgotPassword(email)

    expect(result).toEqual({
      statusCode: 200,
      message:
        "If the email matches an account, a password reset link will be sent with next steps.",
    })
  })

  it("should return success message if sending email fails", async () => {
    const mockUser = { save: vi.fn().mockResolvedValue(true) } // Simulate successful save
    findUserBy.mockResolvedValue(mockUser) // Simulate user found
    const token = "mocked-token"
    generateSalt.mockReturnValue(token) // Mock token generation
    sendPasswordResetEmail.mockResolvedValue(false) // Simulate email sending failure

    const result = await forgotPassword(email)

    expect(result).toEqual({
      statusCode: 200,
      message:
        "If the email matches an account, a password reset link will be sent with next steps.",
    })
  })
})
