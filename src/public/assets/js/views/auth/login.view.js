import { showMessage } from "../../services/message.service.js";

export const buildLoginView = (message) => {
  const contentContainer = document.querySelector(".content");
  contentContainer.id = "login";

  const backButton = createButton("Back", "back", {
    icon: "keyboard-backspace",
    classes: ["back-button"]
  });

  const header = document.createElement("h1");
  header.classList.add("view-header");
  header.textContent = "Account Login";

  const loginForm = buildForm();

  contentContainer.innerHTML = "";
  contentContainer.appendChild(backButton);
  contentContainer.appendChild(header);
  contentContainer.appendChild(loginForm);

  if (message && message.length > 0) {
    const options = {
      hide: true,
      hideDelay: 10000,
      className: "success",
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
  //forgotPasswordMessage.addEventListener("click", clickLoginMessage);
  forgotPasswordMessage.style.marginTop = "0";

  const submitButton = document.createElement("button");
  submitButton.classList.add("button");
  submitButton.type = "submit";
  submitButton.innerHTML =
    "Log In <span class='button-loader hidden' id='submitButtonLoader'</span>";
  submitButton.style.width = "60%";
  submitButton.style.marginTop = "10px";

  const registerMessage = document.createElement("p");
  registerMessage.classList.add("submessage");
  registerMessage.innerHTML =
    "<a class='form-link' id='registerButton'>Don't have an account?</a>";
  //registerMessage.addEventListener("click", clickLoginMessage);

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
