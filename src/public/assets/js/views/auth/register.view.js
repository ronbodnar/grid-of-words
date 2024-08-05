import {
  clickBackButton,
  clickLoginMessage,
  clickRegisterButton,
} from "../../services/event.service.js";

export const buildRegisterView = () => {
  const contentContainer = document.querySelector(".content");
  contentContainer.id = "register";

  const backButton = document.createElement("div");
  backButton.classList.add("back-button");
  backButton.innerHTML =
    "<img src='/assets/material-icons/keyboard-backspace.svg' style='vertical-align: -6px;'> Back";
  backButton.addEventListener("click", clickBackButton);

  const header = document.createElement("h1");
  header.classList.add("view-header");
  header.textContent = "Register Account";

  const registrationForm = buildForm();

  contentContainer.innerHTML = "";
  contentContainer.appendChild(backButton);
  contentContainer.appendChild(header);
  contentContainer.appendChild(registrationForm);
};

const buildForm = () => {
  const form = document.createElement("form");
  form.classList.add("form");
  form.onsubmit = () => {
    clickRegisterButton();
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

  const usernameLabel = document.createElement("label");
  usernameLabel.htmlFor = "username";
  usernameLabel.textContent = "Username";

  const usernameInput = document.createElement("input");
  usernameInput.type = "text";
  usernameInput.placeholder = "Username";
  usernameInput.required = true;
  usernameInput.id = "username";

  const passwordLabel = document.createElement("label");
  passwordLabel.htmlFor = "password";
  passwordLabel.textContent = "Password";

  const passwordInput = document.createElement("input");
  passwordInput.type = "password";
  passwordInput.placeholder = "Password";
  passwordInput.required = true;
  passwordInput.id = "password";

  const confirmPasswordLabel = document.createElement("label");
  confirmPasswordLabel.htmlFor = "confirmPassword";
  confirmPasswordLabel.textContent = "Confirm Password";

  const confirmPasswordInput = document.createElement("input");
  confirmPasswordInput.type = "password";
  confirmPasswordInput.placeholder = "Confirm password";
  confirmPasswordInput.required = true;
  confirmPasswordInput.id = "confirmPassword";

  const submitButton = document.createElement("button");
  submitButton.classList.add("button");
  submitButton.type = "submit";
  submitButton.innerHTML =
    "Register <span class='button-loader hidden' id='registerButtonLoader'</span>";
  submitButton.style.width = "60%";
  submitButton.style.cursor = "pointer";
  submitButton.style.marginTop = "10px";
  submitButton.id = "registerButton";

  const loginMessage = document.createElement("p");
  loginMessage.classList.add("submessage");
  loginMessage.innerHTML = "<a id='loginButton'>Already have an account?</a>";
  loginMessage.addEventListener("click", clickLoginMessage);

  form.appendChild(messageDiv);
  form.appendChild(emailLabel);
  form.appendChild(emailInput);
  form.appendChild(usernameLabel);
  form.appendChild(usernameInput);
  form.appendChild(passwordLabel);
  form.appendChild(passwordInput);
  form.appendChild(confirmPasswordLabel);
  form.appendChild(confirmPasswordInput);
  form.appendChild(submitButton);
  form.appendChild(loginMessage);

  return form;
};
