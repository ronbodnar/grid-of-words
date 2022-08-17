import { EMAIL_REGEX } from "../../../shared/utils/constants.js";
import { showMessage } from "../../../shared/services/message.service.js";
import { submitAuthForm } from "../authentication.service.js";

export const forgotPassword = async () => {
  const emailInput = document.querySelector("#email");
  if (!emailInput) {
    showMessage(
      "An unexpected error has occurred. Please try to reload the page.",
      {
        className: "error",
        hide: false,
      }
    );
    return;
  }

  if (!EMAIL_REGEX.test(emailInput.value)) {
    showMessage("Email is not a valid email address.", {
      className: "error",
      hide: false,
    });
    return;
  }

  const params = {
    email: emailInput.value,
  };

  submitAuthForm("/auth/forgot-password", params);

  // Show a confirmation message to the user and re-enable the email field.
  showMessage(
    "If the email matches an account, a password reset link will be sent with next steps.",
    {
      hide: false,
    }
  );
  emailInput.disabled = true;
};
