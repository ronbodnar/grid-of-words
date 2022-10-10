import User from "../../user/User.js"
import { generateJWT } from "../authentication.service.js"
import { changePassword } from "./change-password.service.js"
import { afterEach, describe, expect, it, vi } from "vitest"

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

// Mock required modules
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

vi.mock("../../user/User.js", async (importOriginal) => {
  const actual = await importOriginal()
  const MockUser = vi.fn((...args) => {
    const instance = new actual.default(...args)
    instance.save = vi.fn(() => true)
    return instance
  })
  return { default: MockUser }
})

vi.mock("../../user/user.repository.js", async (importOriginal) => {
  const actual = await importOriginal()
  return {
    ...actual,
    findUserBy: () => mockUser,
  }
})

describe("changePassword", () => {
  afterEach(() => {
    vi.restoreAllMocks()
  })

  // Test case: Ensure that equal new and current passwords are not allowed.
  it("rejects password change if new and current passwords are identical", async () => {
    const response = await changePassword({
      newPassword: "password",
      currentPassword: "password",
      authToken: mockToken,
    })
    expect(response?.message).toEqual(
      "New password cannot be the same as the current password."
    )
  })

  // Test case: Validate new password length requirements for security.
  it("rejects password change if new password length is below the threshold", async () => {
    const response = await changePassword({
      newPassword: "test",
      currentPassword: "test_old",
      authToken: mockToken,
    })
    expect(response?.message).toEqual(
      "New password must be at least 8 characters long."
    )
  })

  // Test case: Confirm user authentication before allowing password changes.
  it("rejects password change if the user is not authenticated", async () => {
    const response = await changePassword({
      newPassword: "password",
      currentPassword: "password1",
    })
    expect(response?.message).toEqual("User is not authenticated.")
  })

  // Test case: Check authorization before allowing password modification.
  it("rejects password change if the user is not authorized", async () => {
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

  // Test case: Validate current password correctness before proceeding.
  it("rejects password change if current password does not match", async () => {
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

  // Test case: Successful password change should confirm success message.
  it("successfully changes the password for authenticated users", async () => {
    const response = await changePassword({
      newPassword: "password2",
      currentPassword: "password1",
      authToken: mockToken,
      userId: "mock-id",
    })
    expect(response?.message).toEqual("Password changed successfully.")
  })
})
