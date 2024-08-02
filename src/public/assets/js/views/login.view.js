import { clickLoginButton, clickRegisterButton } from "../services/event.service.js";

export const buildLoginView = () => {
    const contentContainer = document.querySelector(".content");
    contentContainer.id = "login";

    const loginForm = buildLoginForm();

    contentContainer.innerHTML = "";
    contentContainer.appendChild(loginForm);
}

const buildLoginForm = () => {
    const form = document.createElement('form');
    form.classList.add("login-form");
    form.onsubmit = () => { clickLoginButton(); return false }; // prevent submission

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
    submitButton.type = "submit";
    submitButton.textContent = "Login";
    submitButton.style.width = "48%";
    submitButton.style.marginRight = "4%";
    submitButton.style.cursor = "pointer";

    const registerButton = document.createElement('button');
    registerButton.type = "button";
    registerButton.textContent = "Register";
    registerButton.style.width = "48%";
    registerButton.style.cursor = "pointer";
    registerButton.addEventListener("click", clickRegisterButton);

    form.appendChild(usernameInput);
    form.appendChild(passwordInput);
    form.appendChild(submitButton);
    form.appendChild(registerButton);

    return form;
}