import { createButton } from "../../../components/button.js";
import { FormGroup } from "../../../components/form/FormGroup.js";
import { buildForm } from "../../../components/form/form.js";
import { handleClickEvent } from "../../../services/event.service.js";
import { showMessage } from "../../../services/message.service.js";

export const buildLoginView = (message) => {
  const contentContainer = document.querySelector(".content");
  contentContainer.id = "login";

  const backButton = createButton("Back", "back", {
    icon: "keyboard-backspace",
    classes: ["back-button"],
  });

  const header = document.createElement("h1");
  header.classList.add("view-header");
  header.textContent = "Account Login";

  const formFields = [
    new FormGroup("Username").setAutoFocus(true),
    new FormGroup("Password")
      .setType("password")
      .setMessage(
        "<a class='form-link' id='showForgotPassword'>Forgot password?</a>"
      ),
  ];

  const formButtons = [createButton("Login")];

  const formOptions = {
    hasMessage: true,
    hasSubmessage: true,
    submessage:
      "<a class='form-link' id='showRegister'>Don't have an account?</a>",
  };

  contentContainer.appendChild(buildForm(formFields, formButtons, formOptions));

  contentContainer.innerHTML = "";
  contentContainer.appendChild(backButton);
  contentContainer.appendChild(header);
  contentContainer.appendChild(buildForm(formFields, formButtons, formOptions));
  //contentContainer.appendChild(buildFormz());

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
    "<a class='form-link' id='showForgotPassword'>Forgot password?</a>";
  forgotPasswordMessage.addEventListener("click", handleClickEvent);
  forgotPasswordMessage.style.marginTop = "0";

  const submitButton = createButton("Log In", "login", {
    loader: true,
    type: "submit",
  });
  submitButton.style.marginTop = "10px";

  const registerMessage = document.createElement("p");
  registerMessage.classList.add("submessage");
  registerMessage.innerHTML =
    "<a class='form-link' id='showRegister'>Don't have an account?</a>";
  registerMessage.addEventListener("click", handleClickEvent);

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
