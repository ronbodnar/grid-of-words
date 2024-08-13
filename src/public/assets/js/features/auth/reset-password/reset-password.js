import { submitAuthForm } from "../../../features/auth/authentication.service.js";
import { showMessage } from "../../../services/message.service.js";
import { retrieveSession } from "../../../services/storage.service.js";
import { showView } from "../../../services/view.service.js";

export const resetPassword = async () => {
  const passwordResetToken = retrieveSession("passwordResetToken");
  if (!passwordResetToken) {
    // TODO: tell users why they were returned home
    showView("home");
    return;
  }

  const newPasswordInput = document.querySelector("#newPassword");
  const confirmNewPasswordInput = document.querySelector("#confirmNewPassword");

  if (!newPasswordInput || !confirmNewPasswordInput) {
    showMessage("Please check all form values and try again.", {
      className: "error",
      hide: false,
    });
    return;
  }

  if (newPasswordInput.value !== confirmNewPasswordInput.value) {
    showMessage("Passwords do not match.", {
      className: "error"
    });
    return;
  }

  const params = {
    passwordResetToken: passwordResetToken,
    newPassword: newPasswordInput.value,
  };

  const successFn = () => {
    showView("login", {
      message:
        "Your password has been changed. Please log in using the new password.",
    });
  }

  await submitAuthForm("", params, successFn);
};
