import InternalError from '../../../errors/InternalError.js'
import ValidationError from '../../../errors/ValidationError.js'
import { resetPassword } from './reset-password.service.js'

export const handleResetPassword = async (req, res, next) => {
  const { newPassword, passwordResetToken } = req.body

  if (!newPassword || !passwordResetToken) {
    return next(new ValidationError('Missing required fields: newPassword, passwordResetToken'))
  }

  const resetPasswordResult = resetPassword(newPassword, passwordResetToken)
  if (!resetPasswordResult) {
    return next(new InternalError('Unexpected error while resetting password'))
  }
  if (resetPasswordResult instanceof Error) {
    return next(resetPasswordResult)
  }

  res.clearCookie('token')
  res.json(resetPasswordResult)
}
