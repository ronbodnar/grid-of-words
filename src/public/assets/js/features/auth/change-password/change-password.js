import { showView } from "../../view/view.service.js";
import { showMessage } from "../../../shared/services/message.service.js";
import { removeSession } from "../../../shared/services/storage.service.js";
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

  if (currentPasswordInput.value.length < 1 || newPasswordInput.value.length < 1 || confirmNewPasswordInput.value.length < 1) {
    showMessage("Passwords must be at least 1 character long.", {
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
