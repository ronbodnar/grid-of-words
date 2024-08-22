import { ValidationError } from "../../../errors/index.js";
import { validateTokenService } from "./index.js";

export const validatePasswordResetToken = async (req, res, next) => {
  const { passwordResetToken } = req.body;
  if (!passwordResetToken) {
    return next(new ValidationError("Missing password reset token."));
  }

  const validTokenResult = await validateTokenService.validatePasswordResetToken(passwordResetToken);
  if (!validTokenResult) {
    return next(new ValidationError("Unexpected error obtaining password reset token result"));
  }
  if (validTokenResult instanceof Error) {
    return next(validTokenResult);
  }
  return res.json(validTokenResult);
};