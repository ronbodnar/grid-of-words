import { clickBackButton, clickLoginButton, clickLoginMessage, clickRegisterButton } from "../services/event.service.js";

export const buildRegisterView = () => {
    const contentContainer = document.querySelector(".content");
    contentContainer.id = "login";

    const header = document.createElement("h1");
    header.classList.add("view-header");
    header.textContent = "Register Account";

    const registrationForm = buildRegistrationForm();

    contentContainer.innerHTML = "";
    contentContainer.appendChild(header);
    contentContainer.appendChild(registrationForm);
}

const buildRegistrationForm = () => {
    const form = document.createElement('form');
    form.classList.add("form");
    form.onsubmit = () => { clickLoginButton(); return false }; // prevent submission

    const backButton = document.createElement("div");
    backButton.classList.add("back-button");
    backButton.innerHTML = "<img src='/assets/material-icons/keyboard-backspace.svg' style='vertical-align: -6px;'> Back";
    backButton.addEventListener("click", clickBackButton);

    const messageDiv = document.createElement("div");
    messageDiv.classList.add("message", "form-message");

    const emailLabel = document.createElement("label");
    emailLabel.htmlFor = "email";
    emailLabel.textContent = "Email";

    const emailInput = document.createElement('input');
    emailInput.type = "text";
    emailInput.placeholder = "Email";
    emailInput.required = true;
    emailInput.value = "";
    emailInput.id = "email";

    const displayNameLabel = document.createElement("label");
    displayNameLabel.htmlFor = "username";
    displayNameLabel.textContent = "Display Name";

    const displayNameInput = document.createElement('input');
    displayNameInput.type = "text";
    displayNameInput.placeholder = "Display Name";
    displayNameInput.required = true;
    displayNameInput.value = "";
    displayNameInput.id = "displayName";

    const passwordLabel = document.createElement("label");
    passwordLabel.htmlFor = "password";
    passwordLabel.textContent = "Password";

    const passwordInput = document.createElement('input');
    passwordInput.type = "password";
    passwordInput.placeholder = "Password";
    passwordInput.required = true;
    passwordInput.value = "";
    passwordInput.id = "password";

    const verifyPasswordLabel = document.createElement("label");
    verifyPasswordLabel.htmlFor = "password";
    verifyPasswordLabel.textContent = "Verify Password";

    const verifyPasswordInput = document.createElement('input');
    verifyPasswordInput.type = "password";
    verifyPasswordInput.placeholder = "Password (again)";
    verifyPasswordInput.required = true;
    verifyPasswordInput.value = "";
    passwordInput.id = "verifyPassword";

    const submitButton = document.createElement('button');
    submitButton.classList.add("button");
    submitButton.type = "submit";
    submitButton.innerHTML = "Register <span class='button-loader hidden' id='loginButtonLoader'</span>";
    submitButton.style.width = "48%";
    submitButton.style.cursor = "pointer";
    submitButton.style.marginRight = "4%"

    const loginMessage = document.createElement('p');
    loginMessage.classList.add("submessage");
    loginMessage.innerHTML = "Already have an account? <a id='loginButton'>Log in</a>";
    loginMessage.addEventListener("click", clickLoginMessage);

    form.appendChild(backButton);
    form.appendChild(messageDiv);
    form.appendChild(emailLabel);
    form.appendChild(emailInput);
    form.appendChild(displayNameLabel);
    form.appendChild(displayNameInput);
    form.appendChild(passwordLabel);
    form.appendChild(passwordInput);
    form.appendChild(verifyPasswordLabel);
    form.appendChild(verifyPasswordInput);
    form.appendChild(submitButton);
    form.appendChild(loginMessage);

    return form;
}