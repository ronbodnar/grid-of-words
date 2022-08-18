import { showMessage } from "../../../shared/services/message.service.js";
import { storeSession } from "../../../shared/services/storage.service.js";
import { showView } from "../../view/view.service.js";
import { EMAIL_REGEX } from "../../../shared/utils/constants.js";
import { submitAuthForm } from "../authentication.service.js";
import { logger } from "../../../main.js";

export const login = async () => {
  const emailInput = document.querySelector("#email");
  const passwordInput = document.querySelector("#password");

  if (!emailInput || !passwordInput) {
    showMessage("Please enter your email address and password.", {
      className: "error",
      hide: false,
    });
    return;
  }

  // Make sure the email doesn't have any invalid characters
  if (!EMAIL_REGEX.test(emailInput.value)) {
    showMessage("Invalid e-mail address format.", {
      className: "error",
      hide: false,
    });
    emailInput.classList.add("error");
    return;
  } else {
    emailInput.classList.remove("error");
  }

  const params = {
    email: emailInput.value,
    password: passwordInput.value,
  };

  const successFn = (response) => {
    if (response?.user) {
      storeSession("user", response.user);
      showView("home");
    } else {
      logger.error("Couldn't login: no user in response", response);
    }
  };

  await submitAuthForm("/auth/login", params, successFn);
};
