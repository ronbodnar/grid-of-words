import {
  clickBackButton,
  clickLoginButton,
  clickLoginMessage,
} from "../../services/event.service.js";
import { showMessage } from "../../services/message.service.js";

export const buildLoginView = (success) => {
  const contentContainer = document.querySelector(".content");
  contentContainer.id = "login";

  const backButton = document.createElement("div");
  backButton.classList.add("back-button");
  backButton.innerHTML =
    "<img src='/assets/material-icons/keyboard-backspace.svg' style='vertical-align: -6px;'> Back";
  backButton.addEventListener("click", clickBackButton);

  const header = document.createElement("h1");
  header.classList.add("view-header");
  header.textContent = "Account Login";

  const loginForm = buildForm();

  contentContainer.innerHTML = "";
  contentContainer.appendChild(backButton);
  contentContainer.appendChild(header);
  contentContainer.appendChild(loginForm);
  
  // Show the registration message for 10 secs and update its class list to show green text.
  if (success === true) {
    const messageDiv = document.querySelector(".message");
    if (messageDiv) {
      messageDiv.classList.add("success");
      // Remove the success class after 11 seconds (1 second buffer so it doesn't change while it's showing).
      setTimeout(() => {
        messageDiv.classList.remove("success");
      }, 11000);
    }

    showMessage("Registration successful. Please log in.", true, 10000);
  }
};

const buildForm = () => {
  const form = document.createElement("form");
  form.classList.add("form");
  form.onsubmit = () => {
    clickLoginButton();
    return false;
  }; // prevent submission

  const messageDiv = document.createElement("div");
  messageDiv.classList.add("message", "form-message");

  const emailLabel = document.createElement("label");
  emailLabel.htmlFor = "email";
  emailLabel.textContent = "Email";

  const emailInput = document.createElement("input");
  emailInput.type = "text";
  emailInput.placeholder = "Email";
  emailInput.required = true;
  emailInput.id = "email";

  const passwordLabel = document.createElement("label");
  passwordLabel.id = "passwordLabel";
  passwordLabel.htmlFor = "password";
  passwordLabel.textContent = "Password";

  const passwordInput = document.createElement("input");
  passwordInput.id = "password";
  passwordInput.type = "password";
  passwordInput.placeholder = "Password";
  passwordInput.required = true;

  const forgotPasswordMessage = document.createElement("p");
  forgotPasswordMessage.style.textAlign = "start";
  forgotPasswordMessage.classList.add("submessage");
  forgotPasswordMessage.innerHTML =
    "<a class='form-link' id='forgotPasswordButton'>Forgot password?</a>";
  forgotPasswordMessage.addEventListener("click", clickLoginMessage);
  forgotPasswordMessage.style.marginTop = "0";

  const submitButton = document.createElement("button");
  submitButton.classList.add("button");
  submitButton.type = "submit";
  submitButton.innerHTML =
    "Log In <span class='button-loader hidden' id='loginButtonLoader'</span>";
  submitButton.style.width = "60%";
  submitButton.style.cursor = "pointer";
  submitButton.style.marginTop = "10px";

  const registerMessage = document.createElement("p");
  registerMessage.classList.add("submessage");
  registerMessage.innerHTML =
    "<a class='form-link' id='registerButton'>Don't have an account?</a>";
  registerMessage.addEventListener("click", clickLoginMessage);

  form.appendChild(messageDiv);
  form.appendChild(emailLabel);
  form.appendChild(emailInput);
  form.appendChild(passwordLabel);
  form.appendChild(passwordInput);
  form.appendChild(forgotPasswordMessage);
  form.appendChild(submitButton);
  form.appendChild(registerMessage);

  return form;
};
