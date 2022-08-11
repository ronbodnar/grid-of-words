import { APP_NAME } from "../constants.js";
import { generateSalt } from "./authentication.service.js";
import { sendEmail } from "./email.service.js";

export const sendResetPasswordEmail = async (user) => {
  const token = generateSalt(32);
  const port =
    process.env.PORT === "80" || process.env.port === "443"
      ? ""
      : ":" + process.env.PORT;
  const resetUrl = process.env.HOSTNAME + port + "?resetToken=" + token;
  console.log("Reset URL", resetUrl);
  const text =
    `Dear ${user.username},\n\n` +
    `We received a request to reset your password for your ${APP_NAME} account. If you didn't make this request, please ignore this email.\n\n` +
    `Please copy this link into your address bar to reset your password:\n` +
    `${resetUrl}\n\n` +
    `Please note that this password reset link is only valid for 1 hour. After that, you'll need to request a new one.\n\n` +
    `Thank you\n` +
    `The ${APP_NAME} Team`;

  const html = `
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
            Hello ${user.username},
          </td>
        </tr>
        <tr>
          <td style="padding-bottom: 20px; font-size: 16px; color: #333333;">
            We received a request to reset your password for your ${APP_NAME} account. If you didn't make this request, please ignore this email.
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
            Thank you,<br/>The ${APP_NAME} Team
          </td>
        </tr>
      </table>
    </td>
  </tr>
</table>
`;

  const response = await sendEmail(
    user.email,
    `Reset Your Password for ${APP_NAME}`,
    text,
    html
  );
  console.log("Response from sendEmail", response);
};
