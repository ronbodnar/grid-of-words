import { InternalError, ValidationError } from "../../../errors/index.js";
import { resetPasswordService } from "./index.js";

export const resetPassword = async (req, res, next) => {
  const { newPassword, passwordResetToken } = req.body;

  if (!newPassword || !passwordResetToken) {
    return next(new ValidationError("Missing required fields: newPassword, passwordResetToken"));
  }

  const resetPasswordResult = resetPasswordService.resetPassword(
    newPassword,
    passwordResetToken
  );
  if (!resetPasswordResult) {
    return next(new InternalError("Unexpected error while resetting password"));
  }
  if (resetPasswordResult instanceof Error) {
    return next(resetPasswordResult);
  }

  res.clearCookie("token");
  res.json(resetPasswordResult);
};