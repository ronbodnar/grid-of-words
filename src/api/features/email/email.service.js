import logger from "../../config/winston.config.js";
import transporter from "../../config/email.config.js";
import { send as sendPasswordResetEmail } from "./reset-password/index.js";

/**
 * Uses Nodemailer to send an email with the default transporter settings.
 * 
 * @async
 * @param {string} to The receiver(s) of the emails. Multiple emails can be separated by commas.
 * @param {string} subject The subject line of the email.
 * @param {string} text The plain text version of the email if HTML is unavailable.
 * @param {string} html The HTML version of the email (if HTML is available).
 * @returns {Promise<boolean>} A promise that resolves to the outcome of the send operation: true or false.
 */
export const sendEmail = async (to, subject, text, html) => {
  const options = {
    from: `"${process.env.SMTP_FROM}" <${process.env.SMTP_USER}>`,
    to: to,
    subject: subject,
    text: text,
    html: html,
  };

  // Obtain the response from the transporter sending the email.
  const sendMailResponse = await transporter.sendMail(options).catch((err) => {
    logger.error("Error sending email: ", options, {
      error: err,
    });
    return null;
  });

  // Response codes 2xx are successful, others are errors. (seems to give 250 most of the time)
  if (!sendMailResponse || !sendMailResponse.response.startsWith("2")) {
    logger.error("Received no response or a non 2xx response code.", options, {
      response: sendMailResponse,
    });
    return false;
  }

  if (sendMailResponse.rejected.length > 0) {
    logger.error("Email(s) were rejected by recipient(s):", options, {
      response: sendMailResponse,
    });
    return false;
  }

  return true;
};

export { sendPasswordResetEmail };
