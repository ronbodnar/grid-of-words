import InternalError from '../../../errors/InternalError.js'
import ValidationError from '../../../errors/ValidationError.js'
import { registerUser } from './register.service.js'

export const handleRegisterUser = async (req, res, next) => {
  const { email, password, username } = req.body

  if (!username || !email || !password) {
    return next(new ValidationError('Missing required fields: username, email, password'))
  }

  const registerResult = await registerUser(username, email, password)
  if (!registerResult) {
    return next(
      new InternalError('Unexpected error while registering user', {
        username: username,
        email: email
      })
    )
  }
  if (registerResult instanceof Error) {
    return next(registerResult)
  }
  return res.json(registerResult)
}
