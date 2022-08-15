import { createButton } from "../../../components/button.js";
import { handleClickEvent } from "../../../services/event.service.js";

export const buildRegisterView = () => {
  const contentContainer = document.querySelector(".content");
  contentContainer.id = "register";

  const backButton = createButton("Back", "back", {
    icon: "keyboard-backspace",
    classes: ["back-button"]
  });

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
    return false;
  };

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

  const submitButton = createButton("Register", "register", {
    loader: true,
    type: "submit",
  });
  submitButton.style.marginTop = "10px";

  const loginMessage = document.createElement("p");
  loginMessage.classList.add("submessage");
  loginMessage.innerHTML = "<a id='showLogin'>Already have an account?</a>";
  loginMessage.addEventListener("click", handleClickEvent);

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
