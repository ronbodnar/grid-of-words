import { InternalError } from "../../../errors/InternalError.js";
import { ValidationError } from "../../../errors/ValidationError.js";
import { resetPasswordService } from "./index.js";

const resetPassword = async (req, res, next) => {
  const { newPassword, passwordResetToken } = req.body;

  if (!newPassword || !passwordResetToken) {
    return next(new ValidationError("Missing required fields."));
  }

  const resetPasswordResult = resetPasswordService.resetPassword(
    newPassword,
    passwordResetToken
  );
  if (!resetPasswordResult) {
    return next(new InternalError("Failed to reset password."));
  }
  if (resetPasswordResult instanceof Error) {
    return next(resetPasswordResult);
  }

  res.clearCookie("token");
  res.json(resetPasswordResult);
};

export default {
  resetPassword,
};
