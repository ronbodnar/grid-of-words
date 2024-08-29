import InternalError from '../../../errors/InternalError.js'
import UnauthorizedError from '../../../errors/UnauthorizedError.js'
import ValidationError from '../../../errors/ValidationError.js'
import { findUserBy } from '../../user/user.repository.js'
import { generateJWT, hashPassword } from '../authentication.service.js'

/**
 * Attempts to log in by authenticating the email/password combination and generates a JWT if successful.
 * @param {string} email The email for the login request.
 * @param {string} password The password for the login request.
 * @returns {Promise<object | ValidationError | UnauthorizedError | InternalError>} A promise that resolves to an object containing a success status and message, the authenticated user, and the generated JWT, or an Error.
 */
export const loginUser = async (email, password) => {
  if (!email || !password) {
    throw new ValidationError('Email and password are required.')
  }

  const authenticatedUser = await authenticate(email, password)
  if (!authenticatedUser) {
    return new UnauthorizedError('Invalid email or password.')
  }

  const jwt = generateJWT(authenticatedUser.getAccountDetails())
  if (!jwt) {
    return new InternalError('Failed to generate JWT', {
      email: email,
      authenticatedUser: authenticatedUser
    })
  }

  return {
    status: 'success',
    message: 'Login successful.',
    user: authenticatedUser,
    token: jwt
  }
}

const authenticate = async (email, password) => {
  const dbUser = await findUserBy('email', email)
  if (!dbUser) {
    return false
  }

  const salt = dbUser.getSalt()
  const userHash = dbUser.getHash()

  // Hash the password with the user's salt (first 16 bytes/32 hex chars are the salt)
  const hashedPassword = hashPassword(password, salt)

  if (hashedPassword === userHash) {
    return dbUser
  } else {
    return null
  }
}
