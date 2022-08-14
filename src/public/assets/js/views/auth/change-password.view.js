import {
  clickBackButton,
  clickChangePasswordButton,
} from "../../services/event.service.js";

export const buildChangePasswordView = () => {
  const contentContainer = document.querySelector(".content");
  contentContainer.id = "change-password";

  const backButton = document.createElement("div");
  backButton.classList.add("back-button");
  backButton.innerHTML =
    "<img src='/assets/material-icons/keyboard-backspace.svg' style='vertical-align: -6px;'> Back";
  backButton.addEventListener("click", clickBackButton);

  const header = document.createElement("h1");
  header.classList.add("view-header");
  header.textContent = "Change Password";

  const submessage = document.createElement("div");
  submessage.classList.add("submessage");
  submessage.textContent =
    "Enter your current password and a new password for your account.";

  const form = buildForm();

  contentContainer.innerHTML = "";
  contentContainer.appendChild(backButton);
  contentContainer.appendChild(header);
  //contentContainer.appendChild(submessage);
  contentContainer.appendChild(form);
};

const buildForm = () => {
  const form = document.createElement("form");
  form.classList.add("form");
  form.style.marginTop = "25px";
  form.onsubmit = () => {
    clickChangePasswordButton();
    return false;
  };

  const messageDiv = document.createElement("div");
  messageDiv.classList.add("message", "form-message", "hidden");

  const currentPasswordLabel = document.createElement("label");
  currentPasswordLabel.htmlFor = "currentPassword";
  currentPasswordLabel.textContent = "Current Password";

  const currentPasswordInput = document.createElement("input");
  currentPasswordInput.type = "password";
  currentPasswordInput.placeholder = "Enter your current password";
  currentPasswordInput.required = true;
  currentPasswordInput.id = "currentPassword";

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
  confirmPasswordLabel.textContent = "Confirm New Password";

  const confirmPasswordInput = document.createElement("input");
  confirmPasswordInput.type = "password";
  confirmPasswordInput.placeholder = "Confirm your new password";
  confirmPasswordInput.required = true;
  confirmPasswordInput.id = "confirmNewPassword";

  const submitButton = document.createElement("button");
  submitButton.classList.add("button");
  submitButton.type = "submit";
  submitButton.innerHTML =
    "Change Password <span class='button-loader hidden' id='submitButtonLoader'</span>";
  submitButton.style.width = "60%";
  submitButton.style.marginTop = "10px";

  form.appendChild(currentPasswordLabel);
  form.appendChild(currentPasswordInput);
  form.appendChild(passwordLabel);
  form.appendChild(passwordInput);
  form.appendChild(confirmPasswordLabel);
  form.appendChild(confirmPasswordInput);
  form.appendChild(messageDiv);
  form.appendChild(submitButton);

  return form;
};
