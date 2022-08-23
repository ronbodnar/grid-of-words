import { ValidationError } from "../../../errors/ValidationError.js";
import { forgotPasswordService } from "./index.js";

const forgotPassword = async (req, res, next) => {
  const email = req.body.email || "";
  if (!email) {
    return next(new ValidationError("Missing email."));
  }

  const forgotPasswordResult = forgotPasswordService.forgotPassword(email);
  if (forgotPasswordResult instanceof Error) {
    return next(forgotPasswordResult);
  }

  res.json(forgotPasswordResult);
};

export default {
  forgotPassword,
};
