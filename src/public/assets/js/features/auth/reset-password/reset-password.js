import { submitAuthForm } from "../../../features/auth/authentication.service.js"
import { showMessage } from "../../../shared/services/message.service.js"
import { retrieveSession } from "../../../shared/services/storage.service.js"
import { showView } from "../../view/view.service.js"

/**
 * Handles the reset password for submission by validating inputs and awaiting {@link submitAuthForm} with a `successFn` callback.
 *
 * @async
 */
export const submitResetPasswordForm = async () => {
  const passwordResetToken = retrieveSession("passwordResetToken")
  if (!passwordResetToken) {
    showView("home", {
      message:
        "Invalid or expired password reset token. Please request a new password reset.",
    })
    return
  }

  const newPasswordInput = document.querySelector("#newPassword")
  const confirmNewPasswordInput = document.querySelector("#confirmNewPassword")

  if (!newPasswordInput || !confirmNewPasswordInput) {
    showMessage("Please check all form values and try again.", {
      className: "error",
      hide: false,
    })
    return
  }

  if (newPasswordInput.value !== confirmNewPasswordInput.value) {
    showMessage("Passwords do not match.", {
      className: "error",
    })
    return
  }

  if (newPasswordInput.length < 8) {
    showMessage("Passwords must be at least 8 character long.", {
      className: "error",
    })
    return
  }

  const params = {
    passwordResetToken: passwordResetToken,
    newPassword: newPasswordInput.value,
  }

  const successFn = () => {
    showView("login", {
      message:
        "Your password has been changed. Please log in using the new password.",
    })
  }

  await submitAuthForm("/auth/reset-password", params, successFn)
}
