import ValidationError from "../../../errors/ValidationError.js";
import { validatePasswordResetToken } from "./validate.token.service.js";

export const handleValidatePasswordResetToken = async (req, res, next) => {
  const { passwordResetToken } = req.body;
  if (!passwordResetToken) {
    return next(new ValidationError("Missing password reset token."));
  }

  const validTokenResult = await validatePasswordResetToken(passwordResetToken);
  if (!validTokenResult) {
    return next(new ValidationError("Unexpected error obtaining password reset token result"));
  }
  if (validTokenResult instanceof Error) {
    return next(validTokenResult);
  }
  return res.json({});
};