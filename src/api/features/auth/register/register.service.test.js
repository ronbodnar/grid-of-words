import { describe, it, expect, beforeEach, vi } from "vitest"
import { registerUser } from "./register.service.js"
import { findUserBy, insertUser } from "../../user/user.repository.js"
import InternalError from "../../../errors/InternalError.js"
import ValidationError from "../../../errors/ValidationError.js"
import User from "../../user/User.js"
import { generateSalt, hashPassword } from "../authentication.service.js" // Import for mocking

// Mock the user repository and authentication service
vi.mock("../../user/user.repository.js")
vi.mock("../authentication.service.js") // Mock authentication service for hash functions

describe("registerUser", () => {
  // Define test constants
  const username = "testuser"
  const email = "test@example.com"
  const password = "testPassword123"

  // Clear mocks before each test case
  beforeEach(() => {
    vi.clearAllMocks()
  })

  // Test case: Should return a ValidationError for invalid username
  it("should return a ValidationError for invalid username", async () => {
    const invalidUsername = "us" // Invalid username (too short)
    const result = await registerUser(invalidUsername, email, password)
    expect(result).toBeInstanceOf(ValidationError)
    expect(result.message).toBe(
      "Username must be 3-16 characters long.\r\nNo symbols other than - and _ allowed."
    )
  })

  // Test case: Should return a ValidationError for invalid email
  it("should return a ValidationError for invalid email", async () => {
    const invalidEmail = "invalidEmail"
    const result = await registerUser(username, invalidEmail, password)
    expect(result).toBeInstanceOf(ValidationError)
    expect(result.message).toBe("Email address is not valid")
  })

  // Test case: Should return a ValidationError for short password
  it("should return a ValidationError for short password", async () => {
    const shortPassword = "short"
    const result = await registerUser(username, email, shortPassword)
    expect(result).toBeInstanceOf(ValidationError)
    expect(result.message).toBe("Password must be at least 8 characters long")
  })

  // Test case: Should return a ValidationError if email is already registered
  it("should return a ValidationError if email is already registered", async () => {
    const mockUser = { email: email } // Simulate existing user
    findUserBy.mockResolvedValue(mockUser) // Simulate user found in the database

    const result = await registerUser(username, email, password)
    expect(result).toBeInstanceOf(ValidationError)
    expect(result.message).toBe("Email address is already registered")
  })

  // Test case: Should return an InternalError if inserting user fails
  it("should return an InternalError if inserting user fails", async () => {
    findUserBy.mockResolvedValue(null) // Simulate no user found

    // Mocking salt and hash generation
    const mockSalt = "mocked-salt"
    const mockHash = hashPassword(password, mockSalt) // Using the hash function
    generateSalt.mockReturnValue(mockSalt) // Mocking salt generation

    const userToInsert = new User({ email, username, password })
    insertUser.mockResolvedValue(null) // Simulate insertion failure

    const result = await registerUser(username, email, password)
    expect(result).toBeInstanceOf(InternalError)
    expect(result.message).toBe("Failed to insert new user into the database")
    expect(insertUser).toHaveBeenCalledWith(userToInsert)
  })

  // Test case: Should return a success message on successful registration
  it("should return a success message on successful registration", async () => {
    findUserBy.mockResolvedValue(null) // Simulate no user found

    // Mocking salt and hash generation
    const mockSalt = "mocked-salt"
    const mockHash = hashPassword(password, mockSalt) // Using the hash function
    generateSalt.mockReturnValue(mockSalt) // Mocking salt generation

    const userToInsert = new User({ email, username, password })
    insertUser.mockResolvedValue(true) // Simulate successful insertion

    const result = await registerUser(username, email, password)
    expect(result).toEqual({ message: "Registration successful" })
    expect(insertUser).toHaveBeenCalledWith(userToInsert)
  })
})
