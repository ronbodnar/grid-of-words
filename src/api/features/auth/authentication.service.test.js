import { describe, it, expect, vi } from "vitest"
import crypto from "node:crypto"
import jwt from "jsonwebtoken"
import logger from "../../config/winston.config.js"
import { findUserBy } from "../user/user.repository.js"
import {
  generateSalt,
  hashPassword,
  generateJWT,
  verifyJWT,
  getAuthenticatedUser,
} from "./authentication.service.js"
import InternalError from "../../errors/InternalError.js"

// Mock external dependencies
vi.mock("node:crypto")
vi.mock("jsonwebtoken")
vi.mock("../../config/winston.config.js")
vi.mock("../user/user.repository.js")

describe("Authentication Service", () => {
  describe("generateSalt", () => {
    // Test case: Verifies generateSalt creates a salt with default byte length
    it("should generate a random salt with default bytes", () => {
      const mockSalt = "72616e646f6d5f73616c74" // Hex representation of 'random_salt'
      const buffer = Buffer.from(mockSalt, "hex")
      crypto.randomBytes.mockReturnValueOnce(buffer)

      const salt = generateSalt()
      expect(salt).toBe(mockSalt)
      expect(crypto.randomBytes).toHaveBeenCalledWith(16) // Default bytes
    })

    // Test case: Generates a random salt with a specified number of bytes
    it("should generate a random salt with specified bytes", () => {
      const mockSalt = "637573746f6d5f73616c74" // Hex representation of 'custom_salt'
      const buffer = Buffer.from(mockSalt, "hex")
      crypto.randomBytes.mockReturnValueOnce(buffer)

      const salt = generateSalt(32)
      expect(salt).toBe(mockSalt)
      expect(crypto.randomBytes).toHaveBeenCalledWith(32)
    })
  })

  describe("hashPassword", () => {
    // Test case: Ensures hashPassword throws an error if input is invalid
    it("should throw an error if password or salt is missing", () => {
      expect(() => hashPassword()).toThrow(InternalError)
      expect(() => hashPassword("password")).toThrow(InternalError)
      expect(() => hashPassword(null, "salt")).toThrow(InternalError)
    })

    // Test case: Returns a valid hashed password using provided password and salt
    it("should return a hashed password", () => {
      const password = "password123"
      const salt = "salt123"
      const hashedValue = "hashed_password"

      // Mock crypto.createHmac to return a mock hashed password
      crypto.createHmac.mockReturnValueOnce({
        update: vi.fn().mockReturnThis(),
        digest: vi.fn().mockReturnValue(hashedValue),
      })

      const hashedPassword = hashPassword(password, salt)
      expect(hashedPassword).toBe(hashedValue)
      expect(crypto.createHmac).toHaveBeenCalledWith("sha256", salt)
    })
  })

  describe("generateJWT", () => {
    // Test case: Checks that an error is thrown if no payload is provided for JWT
    it("should throw an error if no payload is provided", () => {
      expect(generateJWT()).toBeInstanceOf(InternalError)
    })

    // Test case: Generates a valid JWT for a given payload, expiry, and secret
    it("should return a valid JWT", () => {
      const payload = { data: { _id: "user_id" } }
      const secret = "test_secret"
      const token = "generated_token"

      jwt.sign.mockReturnValue(token)

      const result = generateJWT(payload, "1h", secret)
      expect(result).toBe(token)
      expect(jwt.sign).toHaveBeenCalledWith({ data: payload }, secret, {
        expiresIn: "1h",
      })
    })

    // Test case: Ensures sensitive information is removed before generating JWT
    it("should remove sensitive information from the payload", () => {
      const payload = {
        data: {
          _id: "user_id",
          hash: "hashed_password",
          passwordResetToken: "reset_token",
          passwordResetTokenExpiration: "2023-01-01",
        },
      }
      const token = "generated_token"

      jwt.sign.mockReturnValue(token)

      const result = generateJWT(payload)
      expect(result).toBe(token)
      // Verify that sensitive data has been removed from the payload
      expect(payload.data).toEqual({ _id: "user_id" })
    })
  })

  describe("verifyJWT", () => {
    // Test case: Verifies that verifyJWT returns null when no token is provided
    it("should return null if no token is provided", () => {
      const result = verifyJWT()
      expect(result).toBeNull()
    })

    // Test case: Verifies that JWT is correctly decoded and returned
    it("should verify the JWT and return decoded data", () => {
      const token = "test_token"
      const decodedPayload = { data: { _id: "user_id" } }

      jwt.verify.mockReturnValue(decodedPayload)

      const result = verifyJWT(token)
      expect(result).toEqual(decodedPayload)
      expect(jwt.verify).toHaveBeenCalledWith(token, process.env.JWT_SECRET)
    })

    // Test case: Logs an error and returns null if JWT verification fails
    it("should log an error and return null if verification fails", () => {
      const token = "invalid_token"
      const error = new Error("Invalid token")

      jwt.verify.mockImplementation(() => {
        throw error
      })

      const result = verifyJWT(token)
      expect(logger.error).toHaveBeenCalledWith("Failed to verify JWT:", {
        error: error,
        token: token,
      })
      expect(result).toBeNull()
    })
  })

  describe("getAuthenticatedUser", () => {
    // Test case: Ensures getAuthenticatedUser returns null when no token is provided
    it("should return null if no token is provided", async () => {
      const result = await getAuthenticatedUser()
      expect(result).toBeNull()
    })

    // Test case: Ensures getAuthenticatedUser returns null if JWT payload has no data
    it("should return null if the decoded payload has no data", async () => {
      const token = "test_token"
      jwt.verify.mockReturnValueOnce({}) // No data in the payload

      const result = await getAuthenticatedUser(token)
      expect(result).toBeNull()
    })

    // Test case: Returns the user object if the token is valid and user exists
    it("should return the user if the token is valid", async () => {
      const token = "valid_token"
      const decodedPayload = { data: { _id: "user_id" } }
      const user = { _id: "user_id", username: "testUser" }

      jwt.verify.mockReturnValue(decodedPayload)
      findUserBy.mockResolvedValueOnce(user)

      const result = await getAuthenticatedUser(token)
      expect(result).toEqual(user)
      expect(findUserBy).toHaveBeenCalledWith("_id", decodedPayload.data._id)
    })

    // Test case: Returns null if no user is found for the provided token
    it("should return null if the user is not found", async () => {
      const token = "valid_token"
      const decodedPayload = { data: { _id: "user_id" } }

      jwt.verify.mockReturnValue(decodedPayload)
      findUserBy.mockResolvedValueOnce(null) // User not found

      const result = await getAuthenticatedUser(token)
      expect(result).toBeNull()
    })
  })
})
