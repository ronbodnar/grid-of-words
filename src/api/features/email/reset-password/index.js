import InternalError from '../../../errors/InternalError.js'
import { APP_NAME } from '../../../shared/constants.js'
import User from '../../user/User.js'
import { sendEmail } from '../email.service.js'

/**
 * Sends a password reset email with the `token` to the `User`'s email address.
 *
 * @async
 * @param {User} user The user to send the password reset email to.
 * @param {string} token The password reset token that was assigned to the user.
 * @returns {Promise<boolean>} A promise that resolves to the result of the {@link sendEmail} function call.
 */
export const send = async (user, token) => {
  if (!user) {
    throw new InternalError('User not provided')
  }

  const { NODE_ENV, PORT, APP_URL } = process.env

  const portExtension = NODE_ENV === 'production' ? '' : ':' + PORT
  const resetUrl = APP_URL + portExtension + '?token=' + token

  const fnOptions = {
    appName: APP_NAME,
    resetUrl: resetUrl,
    username: user.username
  }

  return sendEmail(
    user.email,
    `Reset Your Password for ${APP_NAME}`,
    getText(fnOptions),
    getHtml(fnOptions)
  )
}

const getHtml = (options) => {
  const { appName, resetUrl, username } = options
  return `
<table width="100%" border="0" cellspacing="0" cellpadding="0" style="font-family: Arial, sans-serif;">
  <tr>
    <td align="center" bgcolor="#f6f6f6" style="padding: 20px;">
      <table width="600" border="0" cellspacing="0" cellpadding="0" style="background-color: #f4f3f2; padding: 20px; border-radius: 5px;">
        <tr>
          <td style="padding-bottom: 20px; text-align: center; font-size: 24px; color: #333333;">
            Password Reset Request
          </td>
        </tr>
        <tr>
          <td style="padding-bottom: 20px; font-size: 16px; color: #333333;">
            Hello ${username},
          </td>
        </tr>
        <tr>
          <td style="padding-bottom: 20px; font-size: 16px; color: #333333;">
            We received a request to reset your password for your ${appName} account. If you didn't make this request, please ignore this email.
          </td>
        </tr>
        <tr>
          <td style="padding-bottom: 20px; font-size: 16px; color: #333333;">
            Please note that this link is only valid for 1 hour. After that, you'll need to request a new one.
          </td>
        </tr>
        <tr>
          <td align="center" style="padding: 20px 0;">
            <a href="${resetUrl}" style="background-color: rgb(0, 163, 108); color: #f4f3f2; padding: 10px 20px; text-decoration: none; border-radius: 5px; font-size: 16px;">Reset Your Password</a>
          </td>
        </tr>
        <tr>
          <td style="font-size: 14px; color: #777777;">
            If the button above doesn't work, copy and paste the following link into your browser:
            <br/>
            <a href="${resetUrl}" style="color: #007bff;">${resetUrl}</a>
          </td>
        </tr>
        <tr>
          <td style="padding-top: 20px; font-size: 14px; color: #777777;">
            Thank you,<br/>The ${appName} Team
          </td>
        </tr>
      </table>
    </td>
  </tr>
</table>
`
}

const getText = (options) => {
  const { appName, resetUrl, username } = options
  return (
    `Dear ${username},\n\n` +
    `We received a request to reset your password for your ${appName} account. If you didn't make this request, please ignore this email.\n\n` +
    `Please copy this link into your address bar to reset your password:\n` +
    `${resetUrl}\n\n` +
    `Please note that this password reset link is only valid for 1 hour. After that, you'll need to request a new one.\n\n` +
    `Thank you\n` +
    `The ${appName} Team`
  )
}
