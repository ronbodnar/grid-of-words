import { createButton } from "../../../components/button.js";
import { showMessage } from "../../../services/message.service.js";

export const buildForgotPasswordView = (message) => {
  const contentContainer = document.querySelector(".content");
  contentContainer.id = "forgot-password";

  const backButton = createButton("Back", "back", {
    icon: "keyboard-backspace",
    classes: ["back-button"]
  });

  const header = document.createElement("h1");
  header.classList.add("view-header");
  header.textContent = "Forgotten Password?";

  const submessage = document.createElement("div");
  submessage.classList.add("submessage");
  submessage.textContent =
    "Enter your email address to receive a password reset link.";

  const form = buildForm();

  contentContainer.innerHTML = "";
  contentContainer.appendChild(backButton);
  contentContainer.appendChild(header);
  contentContainer.appendChild(submessage);
  contentContainer.appendChild(form);

  if (message && message.length > 0) {
    const options = {
      hide: false,
      className: "error",
    };

    showMessage(message, options);
  }
};

const buildForm = () => {
  const form = document.createElement("form");
  form.classList.add("form");
  form.onsubmit = () => {
    return false;
  };
  form.style.marginTop = "25px";

  const messageDiv = document.createElement("div");
  messageDiv.classList.add("message", "form-message", "hidden");
  messageDiv.style.width = "100%";

  const emailLabel = document.createElement("label");
  emailLabel.htmlFor = "email";
  emailLabel.textContent = "Email";

  const emailInput = document.createElement("input");
  emailInput.type = "email";
  emailInput.placeholder = "Email";
  emailInput.required = true;
  emailInput.id = "email";

  const submitButton = createButton("Send Email", "forgotPassword", {
    loader: true,
    type: "submit"
  });
  submitButton.style.width = "60%";
  submitButton.style.marginTop = "10px";

  form.appendChild(emailLabel);
  form.appendChild(emailInput);
  form.appendChild(messageDiv);
  form.appendChild(submitButton);

  return form;
};
