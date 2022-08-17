import { createButton } from "../../../shared/components/button.js";

/**
 * Generates all components for the change password view (form, headers, nav) and adds them to the content container.
 */
export const buildChangePasswordView = () => {
  const contentContainer = document.querySelector(".content");
  contentContainer.id = "change-password";

  const backButton = createButton("Back", {
    icon: "keyboard-backspace",
    classes: ["back-button"]
  });

  const header = document.createElement("h1");
  header.classList.add("view-header");
  header.textContent = "Change Password";

  const form = buildForm();

  contentContainer.innerHTML = "";
  contentContainer.appendChild(backButton);
  contentContainer.appendChild(header);
  contentContainer.appendChild(form);
};

const buildForm = () => {
  const form = document.createElement("form");
  form.classList.add("form");
  form.style.marginTop = "25px";
  form.onsubmit = () => {
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

  const submitButton = createButton("Change Password", {
    loader: true,
  });
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
