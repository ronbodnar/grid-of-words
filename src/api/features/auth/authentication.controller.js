import logger from "../../config/winston.config.js";
import { userRepository } from "../user/index.js";
import { authService } from "./index.js";
import { ValidationError } from "../../errors/ValidationError.js";
import { UnauthorizedError } from "../../errors/UnauthorizedError.js";

export const validatePasswordResetToken = async (req, res, next) => {
  const passwordResetToken = req.body.passwordResetToken;
  if (!passwordResetToken) {
    return next(new ValidationError("Missing password reset token."));
  }

  const authenticatedUser = await userRepository.findBy(
    "passwordResetToken",
    passwordResetToken
  );
  if (!authenticatedUser) {
    return next(
      new UnauthorizedError(
        "The password reset token is invalid. Please request a new token."
      )
    );
  }

  const tokenExpiration = new Date(
    authenticatedUser.passwordResetTokenExpiration
  );
  if (Date.now() >= tokenExpiration) {
    return next(
      new UnauthorizedError(
        "The password reset token has expired. Please request a new token."
      )
    );
  }

  return res.json({
    status: "success",
    message: "The password reset token is valid.",
  });
};

/**
 * Extract session data from cookies sent in the request.
 */
export const getSession = (req, res, next) => {
  // If no API Key is present in the request, provide it to the user as an HttpOnly cookie.
  if (!req.cookies?.apiKey) {
    authService.setApiKeyCookie(res);
  }

  let sessionData = {};

  if (req.cookies?.token) {
    const payload = authService.verifyToken(req.cookies.token);

    logger.info("Payload data from session token", {
      payload: payload,
    });

    // The payload has data containing our user object.
    if (payload?.data) {
      sessionData.user = payload.data;
    }
  }

  if (req.cookies?.game) {
    sessionData.game = req.cookies.game;
  }

  console.log("Session data", sessionData);

  res.json(Object.keys(sessionData).length > 0 ? sessionData : {});
};
