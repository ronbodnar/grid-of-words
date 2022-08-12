import nodemailer from "nodemailer";
import logger from "../config/winston.config.js";

// Set up the transport with the email settings in the .env file.
// Secure will automatically be set to true if the port is 465.
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  secure: process.env.SMTP_PORT === 465,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

/**
 * Uses Nodemailer to send an email with the default transporter settings.
 * @param {*} to The receiver(s) of the emails. Multiple emails can be separated by commas.
 * @param {*} subject The subject line of the email.
 * @param {*} text The plain text version of the email if HTML is unavailable.
 * @param {*} html The HTML version of the email (if HTML is available).
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

  // Response codes 2xx are successful, we others are errored.
  if (!sendMailResponse || !sendMailResponse.response.startsWith("2")) {
    logger.error("Received no response or a non 2xx response code.", options, {
      response: sendMailResponse,
    });
    return false;
  }

  // Check if any emails were rejected by the recipient.
  if (sendMailResponse.rejected.length > 0) {
    logger.error("Email(s) were rejected by recipient(s):", options, {
      response: sendMailResponse,
    });
    return false;
  }

  return true;
};