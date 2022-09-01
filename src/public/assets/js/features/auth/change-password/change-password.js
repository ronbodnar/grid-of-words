import { showView } from "../../view/view.service.js"
import { showMessage } from "../../../shared/services/message.service.js"
import { removeSession } from "../../../shared/services/storage.service.js"
import {
  getAuthenticatedUser,
  submitAuthForm,
} from "../authentication.service.js"
import { logger } from "../../../main.js"

/**
 * Handles submission of the change password form by validating inputs and awaiting {@link submitAuthForm}.
 *
 * @async
 */
export const submitChangePasswordForm = async () => {
  const currentPasswordInput = document.querySelector("#currentPassword")
  const newPasswordInput = document.querySelector("#newPassword")
  const confirmNewPasswordInput = document.querySelector("#confirmNewPassword")

  if (!currentPasswordInput || !newPasswordInput || !confirmNewPasswordInput) {
    throw new Error("Missing input element(s)")
  }

  if (newPasswordInput.value !== confirmNewPasswordInput.value) {
    showMessage("New passwords do not match.", {
      className: "error",
      hide: false,
    })
    return
  }

  if (
    currentPasswordInput.value.length < 8 ||
    newPasswordInput.value.length < 8 ||
    confirmNewPasswordInput.value.length < 8
  ) {
    showMessage("Passwords must be at least 8 character long.", {
      className: "error",
      hide: false,
    })
    return
  }

  const authenticatedUser = getAuthenticatedUser()

  const params = {
    currentPassword: currentPasswordInput.value,
    newPassword: newPasswordInput.value,
    userId: authenticatedUser._id,
  }

  const successFn = (test) => {
    logger.debug("Running successFn", test)
    removeSession("user")
    showView("login", {
      message:
        "Password successfully updated. Please log in with your new password.",
      className: "success",
      hideDelay: 10000,
    })
  }

  await submitAuthForm("/auth/change-password", params, successFn)
}
