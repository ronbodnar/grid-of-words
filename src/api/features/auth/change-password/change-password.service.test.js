import User from "../../user/User.js"
import { generateJWT } from "../authentication.service.js"
import { changePassword } from "./change-password.service.js"
import { afterEach, assert, describe, expect, it, vi } from "vitest"

const mockToken = generateJWT(
  {
    _id: "mock-id",
  },
  "1d",
  "fakesecret"
)

const mockUser = new User({
  _id: "mock-id",
  username: "test",
  password: "password1",
  email: "test@example.com",
})

// Mock the required import modules for creating a password
vi.mock("../authentication.service.js", async (importOriginal) => {
  const actual = await importOriginal()
  return {
    ...actual,
    verifyJWT: async (token) => {
      if (!token) return null
      return {
        data: { _id: "mock-id" },
      }
    },
  }
})

// Mock the save function for the User class while keeping structure intact.
vi.mock("../../user/User.js", async (importOriginal) => {
  const actual = await importOriginal()
  const MockUser = vi.fn((...args) => {
    const instance = new actual.default(...args)

    instance.save = vi.fn(() => true)

    return instance
  })
  return { default: MockUser }
})

// Mock the findUserBy function
vi.mock("../../user/user.repository.js", async (importOriginal) => {
  const actual = await importOriginal()
  return {
    ...actual,
    findUserBy: () => mockUser,
  }
})

// Start running tests
describe("changePassword", () => {
  afterEach(() => {
    vi.restoreAllMocks()
  })

  it("should fail because both new and current password are equal", async () => {
    const response = await changePassword({
      newPassword: "password",
      currentPassword: "password",
      authToken: mockToken,
    })
    expect(response?.message).toEqual(
      "New password cannot be the same as the current password."
    )
  })

  it("should fail because the new password length is invalid", async () => {
    const response = await changePassword({
      newPassword: "test",
      currentPassword: "test_old",
      authToken: mockToken,
    })
    expect(response?.message).toEqual(
      "New password must be at least 8 characters long."
    )
  })

  it("should fail because the user is not authenticated", async () => {
    const response = await changePassword({
      newPassword: "password",
      currentPassword: "password1",
    })
    expect(response?.message).toEqual("User is not authenticated.")
  })

  it("should fail because the user is not allowed to change the password", async () => {
    const response = await changePassword({
      newPassword: "password",
      currentPassword: "password1",
      authToken: mockToken,
      userId: "nogood",
    })

    expect(response?.message).toEqual(
      "You are not authorized to change this password."
    )
  })

  it("should fail because the current passwords do not match", async () => {
    const response = await changePassword({
      newPassword: "password1",
      currentPassword: "password",
      authToken: mockToken,
      userId: "mock-id",
    })
    expect(response?.message).toEqual(
      "The current password you provided is not correct."
    )
  })

  it("should pass and change the password", async () => {
    const response = await changePassword({
      newPassword: "password2",
      currentPassword: "password1",
      authToken: mockToken,
      userId: "mock-id",
    })
    expect(response?.message).toEqual("Password changed successfully.")
  })
})
