import { EMAIL_REGEX } from "../../../shared/utils/constants.js";
import { showMessage } from "../../../shared/services/message.service.js";
import { submitAuthForm } from "../authentication.service.js";

/**
 * Handles the submission of the forgot password form by validating inputs, invoking {@link submitAuthForm}, and displaying a message to the user.
 */
export const submitForgotPasswordForm = async () => {
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

  // Don't await because the user doesn't need to know we found the email address (or not).
  submitAuthForm("/auth/forgot-password", params);

  showMessage(
    "If the email matches an account, a password reset link will be sent with next steps.",
    {
      hide: false,
    }
  );
  emailInput.disabled = true;
};
