import { showView } from "../../../services/view.service.js";
import { showMessage } from "../../../services/message.service.js";
import { removeSession } from "../../../services/storage.service.js";
import { submitAuthForm } from "../authentication.service.js";

export const changePassword = async () => {
  const currentPasswordInput = document.querySelector("#currentPassword");
  const newPasswordInput = document.querySelector("#newPassword");
  const confirmNewPasswordInput = document.querySelector("#confirmNewPassword");

  if (!currentPasswordInput || !newPasswordInput || !confirmNewPasswordInput) {
    console.error(
      "Missing input element(s)",
      currentPasswordInput,
      newPasswordInput,
      confirmNewPasswordInput
    );
    return;
  }

  if (newPasswordInput.value !== confirmNewPasswordInput.value) {
    showMessage("New passwords do not match.", {
      className: "error",
      hide: false,
    });
    return;
  }

  const params = {
    currentPassword: currentPasswordInput.value,
    newPassword: newPasswordInput.value,
  };

  const successFn = (test) => {
    console.log("Running successFn", test);
    removeSession("user");
    showView("login", {
      message:
        "Password successfully updated. Please log in with your new password.",
      className: "success",
      hideDelay: 10000,
    });
  };

  await submitAuthForm("/auth/change-password", params, successFn);
};
