import { InternalError, ValidationError } from "../../../errors/index.js";
import changePasswordService from "./change-password.service.js";

export const changePassword = async (req, res, next) => {
  const authToken = req.cookies.token;
  const { currentPassword, newPassword } = req.body;

  if (!newPassword || !currentPassword) {
    return next(
      new ValidationError("Current and new passwords must be provided.")
    );
  }

  const changePasswordResult = await changePasswordService.changePassword(
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
