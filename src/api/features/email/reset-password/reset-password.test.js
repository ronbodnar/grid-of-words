import { send } from "./reset-password.js"
import { sendEmail } from "../email.service.js"
import InternalError from "../../../errors/InternalError.js"
import { APP_NAME } from "../../../shared/constants.js"
import { vi, describe, it, expect, afterEach } from "vitest"

// Mock the sendEmail function
vi.mock("../email.service.js", () => ({
  sendEmail: vi.fn(),
}))

describe("reset-password.service", () => {
  const user = {
    email: "test@example.com",
    username: "testuser",
  }

  const token = "testToken"

  afterEach(() => {
    vi.clearAllMocks()
  })

  // Test case: Should throw an error if no user is provided
  it("should throw an error if no user is provided", async () => {
    await expect(send(null, token)).rejects.toThrow(InternalError)
  })

  // Test case: Should call sendEmail with correct parameters
  it("should call sendEmail with correct parameters", async () => {
    const mockResetUrl = "http://localhost:3000?token=testToken"
    process.env.NODE_ENV = "development"
    process.env.PORT = "3000"
    process.env.APP_URL = "http://localhost"

    sendEmail.mockResolvedValue(true)

    const result = await send(user, token)

    expect(sendEmail).toHaveBeenCalledWith(
      user.email,
      `Reset Your Password for ${APP_NAME}`,
      expect.stringContaining("Dear testuser"),
      expect.stringContaining(mockResetUrl)
    )
    expect(result).toBe(true)
  })
})
