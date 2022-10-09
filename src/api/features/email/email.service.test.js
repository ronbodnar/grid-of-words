import { sendEmail } from "./email.service.js"
import transporter from "../../config/email.config.js"
import { describe, it, expect, vi, afterEach, beforeEach } from "vitest"
import { logger } from "../../config/winston.config.js"

// Mock dependencies
vi.mock("../../config/email.config.js")

describe("sendEmail", () => {
  const emailOptions = {
    to: "recipient@example.com",
    subject: "Test Subject",
    text: "This is a test email",
    html: "<p>This is a test email</p>",
  }

  beforeEach(() => {
    // Spy on logger.error to ensure it's being called
    vi.spyOn(logger, "error")
  })

  afterEach(() => {
    vi.clearAllMocks() // Clear mocks after each test
  })

  it("should send an email and return true when the response code starts with 2xx", async () => {
    // Mock the response from the transporter to simulate a successful email
    transporter.sendMail.mockResolvedValueOnce({
      response: "250 Message accepted",
      rejected: [],
    })

    const result = await sendEmail(
      emailOptions.to,
      emailOptions.subject,
      emailOptions.text,
      emailOptions.html
    )

    expect(result).toBe(true)
    expect(transporter.sendMail).toHaveBeenCalledWith({
      from: `"${process.env.SMTP_FROM}" <${process.env.SMTP_USER}>`,
      to: emailOptions.to,
      subject: emailOptions.subject,
      text: emailOptions.text,
      html: emailOptions.html,
    })
  })

  it("should log an error and return false when the transporter throws an error", async () => {
    const errorMessage = new Error("Transporter Error")
    transporter.sendMail.mockRejectedValueOnce(errorMessage)

    const result = await sendEmail(
      emailOptions.to,
      emailOptions.subject,
      emailOptions.text,
      emailOptions.html
    )

    expect(result).toBe(false)
    expect(logger.error).toHaveBeenCalledWith(
      "Error sending email: ",
      expect.anything(),
      expect.objectContaining({ error: errorMessage })
    )
  })

  it("should log an error and return false when the response does not start with 2xx", async () => {
    // Mock the response to simulate a non-2xx response code
    transporter.sendMail.mockResolvedValueOnce({
      response: "500 Internal Server Error",
      rejected: [],
    })

    const result = await sendEmail(
      emailOptions.to,
      emailOptions.subject,
      emailOptions.text,
      emailOptions.html
    )

    expect(result).toBe(false)
    expect(logger.error).toHaveBeenCalledWith(
      "Received no response or a non 2xx response code.",
      expect.anything(),
      expect.objectContaining({
        response: expect.objectContaining({
          response: "500 Internal Server Error",
        }),
      })
    )
  })

  it("should log an error and return false if the email is rejected by recipients", async () => {
    transporter.sendMail.mockResolvedValueOnce({
      response: "250 Message accepted",
      rejected: ["recipient@example.com"],
    })

    const result = await sendEmail(
      emailOptions.to,
      emailOptions.subject,
      emailOptions.text,
      emailOptions.html
    )

    expect(result).toBe(false)
    expect(logger.error).toHaveBeenCalledWith(
      "Email(s) were rejected by recipient(s):",
      expect.anything(),
      expect.objectContaining({
        response: expect.objectContaining({
          rejected: ["recipient@example.com"],
        }),
      })
    )
  })
})
