// login.service.test.js
import { describe, it, expect, beforeEach, vi } from "vitest"
import { loginUser, authenticate } from "./login.service.js"
import { findUserBy } from "../../user/user.repository.js"
import { generateJWT, hashPassword } from "../authentication.service.js"
import InternalError from "../../../errors/InternalError.js"
import UnauthorizedError from "../../../errors/UnauthorizedError.js"
import ValidationError from "../../../errors/ValidationError.js"

vi.mock("../../user/user.repository.js")
vi.mock("../authentication.service.js")
vi.mock("./login.service.js", async (importOriginal) => {
  const actual = await importOriginal()
  return {
    ...actual,
    authenticate: async () => true,
  }
})

describe("loginUser", () => {
  const email = "test@example.com"
  const password = "password1"

  beforeEach(() => {
    vi.clearAllMocks() // Clear mocks before each test
  })

  it("should throw a validation error if email or password is missing", async () => {
    await expect(loginUser(null, password)).rejects.toThrow(ValidationError)
    await expect(loginUser(email, null)).rejects.toThrow(ValidationError)
  })

  it("should return an UnauthorizedError if the user is not found", async () => {
    findUserBy.mockResolvedValue(null) // Simulate user not found

    const result = await loginUser(email, password)

    expect(result).toBeInstanceOf(UnauthorizedError)
    expect(result.message).toBe("Invalid email or password.")
    expect(findUserBy).toHaveBeenCalledWith("email", email)
  })

  it("should return an InternalError if JWT generation fails", async () => {
    const mockUser = {
      getAccountDetails: vi.fn().mockReturnValue({
        _id: "mock-id",
        username: "test",
        email: email,
      }),
      getSalt: vi.fn().mockReturnValue("mocked-salt"),
      getHash: vi.fn().mockReturnValue("mocked-hash"),
    }

    // Simulate user found
    findUserBy.mockResolvedValue(mockUser)

    // Simulate successful password hash matching
    vi.mocked(hashPassword).mockReturnValue("mocked-hash") // Mock the password hashing to match
    vi.spyOn(mockUser, "getHash").mockReturnValue("mocked-hash") // Ensure the user hash matches

    generateJWT.mockReturnValue(null) // Simulate JWT generation failure

    const result = await loginUser(email, password)

    expect(result).toBeInstanceOf(InternalError)
    expect(result.message).toBe("Failed to generate JWT")
    expect(generateJWT).toHaveBeenCalledWith(mockUser.getAccountDetails())
  })

  it("should return success object on successful login", async () => {
    const mockUser = {
      getAccountDetails: vi.fn().mockReturnValue({
        _id: "mock-id",
        username: "test",
        password: password,
        email: email,
      }),
      getSalt: vi.fn().mockReturnValue("mocked-salt"),
      getHash: vi.fn().mockReturnValue("mocked-hash"),
    }
    findUserBy.mockResolvedValue(mockUser) // Simulate user found
    hashPassword.mockReturnValue("mocked-hash") // Simulate password hashing
    generateJWT.mockReturnValue("mocked-jwt") // Simulate successful JWT generation

    const result = await loginUser(email, password)

    expect(result).toEqual({
      status: "success",
      message: "Login successful.",
      user: mockUser,
      token: "mocked-jwt",
    })
  })
})
