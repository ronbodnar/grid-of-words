import ValidationError from "../../../errors/ValidationError.js";
import { forgotPassword } from "./forgot-password.service.js";

export const handleForgotPassword = async (req, res, next) => {
  const email = req.body.email || "";
  if (!email) {
    return next(new ValidationError("Missing email."));
  }

  const forgotPasswordResult = forgotPassword(email);
  if (forgotPasswordResult instanceof Error) {
    return next(forgotPasswordResult);
  }

  res.json(forgotPasswordResult);
};