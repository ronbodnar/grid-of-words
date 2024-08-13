import { showMessage } from "../../../services/message.service.js";
import { storeSession } from "../../../services/storage.service.js";
import { showView } from "../../../services/view.service.js";
import { EMAIL_REGEX } from "../../../utils/constants.js";
import { submitAuthForm } from "../authentication.service.js";

export const login = async () => {
  const emailInput = document.querySelector("#email");
  const passwordInput = document.querySelector("#password");

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
      console.error("Couldn't login: no user in response", response);
    }
  };

  await submitAuthForm("/auth/login", params, successFn);
};
