import { clickBackButton, clickLoginButton, clickRegisterButton } from "../services/event.service.js";

export const buildLoginView = () => {
    const contentContainer = document.querySelector(".content");
    contentContainer.id = "login";

    const header = document.createElement("h1");
    header.classList.add("view-header");
    header.textContent = "Account Login";

    const loginForm = buildLoginForm();

    contentContainer.innerHTML = "";
    contentContainer.appendChild(header);
    contentContainer.appendChild(loginForm);
}

const buildLoginForm = () => {
    const form = document.createElement('form');
    form.classList.add("form");
    form.onsubmit = () => { clickLoginButton(); return false }; // prevent submission

    const backButton = document.createElement("div");
    backButton.classList.add("back-button");
    backButton.innerHTML = "<img src='/assets/material-icons/keyboard-backspace.svg' style='vertical-align: -6px;'> Back";
    backButton.addEventListener("click", clickBackButton);

    const messageDiv = document.createElement("div");
    messageDiv.classList.add("message", "form-message");

    const usernameInput = document.createElement('input');
    usernameInput.type = "text";
    usernameInput.placeholder = "Username";
    usernameInput.required = true;
    usernameInput.id = "username";

    const passwordInput = document.createElement('input');
    passwordInput.type = "password";
    passwordInput.placeholder = "Password";
    passwordInput.required = true;
    passwordInput.id = "password";

    const submitButton = document.createElement('button');
    submitButton.classList.add("button");
    submitButton.type = "submit";
    submitButton.innerHTML = "Log In <span class='button-loader hidden' id='loginButtonLoader'</span>";
    submitButton.style.width = "48%";
    submitButton.style.cursor = "pointer";
    submitButton.style.marginRight = "4%"

    const registerButton = document.createElement('button');
    registerButton.classList.add("button", "secondary");
    registerButton.type = "button";
    registerButton.textContent = "Register";
    registerButton.style.width = "48%";
    registerButton.style.cursor = "pointer";
    registerButton.addEventListener("click", clickRegisterButton);

    form.appendChild(backButton);
    form.appendChild(messageDiv);
    form.appendChild(usernameInput);
    form.appendChild(passwordInput);
    form.appendChild(submitButton);
    form.appendChild(registerButton);

    return form;
}