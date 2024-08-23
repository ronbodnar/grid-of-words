import InternalError from "../../../errors/InternalError.js";
import ValidationError from "../../../errors/ValidationError.js";
import { changePassword } from "./change-password.service.js";

export const handleChangePassword = async (req, res, next) => {
  const authToken = req.cookies.token;
  const { currentPassword, newPassword } = req.body;

  if (!newPassword || !currentPassword) {
    return next(
      new ValidationError("Current and new passwords must be provided.")
    );
  }

  const changePasswordResult = await changePassword(
    newPassword,
    currentPassword,
    authToken
  );
  if (!changePasswordResult) {
    return next(new InternalError("Unexpected error while changing password."));
  }

  if (changePasswordResult instanceof Error) {
    return next(changePasswordResult);
  }

  res.clearCookie("token");
  res.json(changePasswordResult);
};
