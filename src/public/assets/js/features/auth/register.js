import { EMAIL_REGEX, USERNAME_REGEX } from "../../utils/constants.js";
import { showMessage } from "../../services/message.service.js";
import { submitAuthForm } from "../../services/authentication.service.js";

export const registerUser = async () => {
  const emailInput = document.querySelector("#email");
  const passwordInput = document.querySelector("#password");
  const confirmPasswordInput = document.querySelector("#confirmPassword");
  const usernameInput = document.querySelector("#username");

  if (
    !emailInput ||
    !passwordInput ||
    !confirmPasswordInput ||
    !usernameInput
  ) {
    showMessage("Please check all form values and try again.", {
      className: "error",
      hide: false,
    });
    return;
  }

  if (!EMAIL_REGEX.test(emailInput.value)) {
    showMessage("Email is not a valid email address.", {
      className: "error",
      hide: false,
    });
    emailInput.classList.add("error");
    return;
  } else {
    emailInput.classList.remove("error");
  }

  if (!USERNAME_REGEX.test(usernameInput.value)) {
    showMessage(
      "Username must be 3-16 characters long.\r\nA-z, numbers, hyphen, underscore, spaces only.",
      {
        className: "error",
        hide: false,
      }
    );
    usernameInput.classList.add("error");
    return;
  } else {
    usernameInput.classList.remove("error");
  }

  if (passwordInput.value !== confirmPasswordInput.value) {
    showMessage("Passwords do not match.", {
      className: "error",
      hide: false,
    });
    passwordInput.classList.add("error");
    confirmPasswordInput.classList.add("error");
    return;
  } else {
    passwordInput.classList.remove("error");
    confirmPasswordInput.classList.remove("error");
  }

  const params = {
    email: emailInput.value,
    username: usernameInput.value,
    password: passwordInput.value,
  };

  const successFn = () => {
    showView("login", {
      message: "Registration successful. Please log in to your account.",
    });
  };

  await submitAuthForm("/auth/register", params, successFn);
};
