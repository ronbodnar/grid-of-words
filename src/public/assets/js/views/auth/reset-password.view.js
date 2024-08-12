import {
  clickBackButton,
  clickResetPasswordButton,
} from "../../services/event.service.js";

export const buildResetPasswordView = () => {
  const contentContainer = document.querySelector(".content");
  contentContainer.id = "reset-password";

  const backButton = document.createElement("div");
  backButton.classList.add("back-button");
  backButton.innerHTML =
    "<img src='/assets/material-icons/keyboard-backspace.svg' style='vertical-align: -6px;'> Back";
  backButton.addEventListener("click", clickBackButton);

  const header = document.createElement("h1");
  header.classList.add("view-header");
  header.textContent = "Reset Password";

  const submessage = document.createElement("div");
  submessage.classList.add("submessage");
  submessage.textContent = "Enter a new password for your account.";

  const form = buildForm();

  contentContainer.innerHTML = "";
  contentContainer.appendChild(backButton);
  contentContainer.appendChild(header);
  contentContainer.appendChild(submessage);
  contentContainer.appendChild(form);
};

const buildForm = () => {
  const form = document.createElement("form");
  form.classList.add("form");
  form.style.marginTop = "25px";
  form.onsubmit = () => {
    clickResetPasswordButton();
    return false;
  };

  const messageDiv = document.createElement("div");
  messageDiv.classList.add("message", "form-message", "hidden");

  const passwordLabel = document.createElement("label");
  passwordLabel.htmlFor = "newPassword";
  passwordLabel.textContent = "New Password";

  const passwordInput = document.createElement("input");
  passwordInput.type = "password";
  passwordInput.placeholder = "Enter your new password";
  passwordInput.required = true;
  passwordInput.id = "newPassword";

  const confirmPasswordLabel = document.createElement("label");
  confirmPasswordLabel.htmlFor = "confirmNewPassword";
  confirmPasswordLabel.textContent = "Confirm Password";

  const confirmPasswordInput = document.createElement("input");
  confirmPasswordInput.type = "password";
  confirmPasswordInput.placeholder = "Confirm your new password";
  confirmPasswordInput.required = true;
  confirmPasswordInput.id = "confirmNewPassword";

  const submitButton = document.createElement("button");
  submitButton.classList.add("button");
  submitButton.type = "submit";
  submitButton.innerHTML =
    "Update Password <span class='button-loader hidden' id='submitButtonLoader'</span>";
  submitButton.style.width = "60%";
  submitButton.style.marginTop = "10px";

  form.appendChild(passwordLabel);
  form.appendChild(passwordInput);
  form.appendChild(confirmPasswordLabel);
  form.appendChild(confirmPasswordInput);
  form.appendChild(messageDiv);
  form.appendChild(submitButton);

  return form;
};
