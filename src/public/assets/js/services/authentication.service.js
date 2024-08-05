import { showView } from "../utils/helpers.js";
import { showMessage } from "./message.service.js";
import { store, retrieve } from "./storage.service.js";

export const authenticate = async (email, password) => {
    const loginButtonLoader = document.querySelector('#loginButtonLoader');
    loginButtonLoader?.classList.remove('hidden');

    console.log("Trying to authenticate", email, password);
    
    const response = await fetch(`/auth/login/`, {
        method: "POST",
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            email: email,
            password: password
        })
    }).catch(err => console.log(err));

    const data = await response.json();

    loginButtonLoader?.classList.add('hidden');

    if (data.error) {
        showMessage(data.error, false)
        return;
    }
    
    if (data.user) {
        store("user", data.user);
        showView("home");
    }

    console.log("authenticate response", data);
}

export const register = async (email, username, password) => {
    const registerButton = document.querySelector('#registerButton');
    if (registerButton)
        registerButton.disabled = true;

    const registerButtonLoader = document.querySelector('#registerButtonLoader');
    registerButtonLoader?.classList.remove('hidden');

    console.log("Trying to register", email, username, password)
    
    const response = await fetch(`/auth/register/`, {
        method: "POST",
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            email: email,
            username: username,
            password: password
        })
    }).catch(err => console.log(err));

    const data = await response.json();

    console.log("registration response", data);
}

export const isAuthenticated = () => {
    const user = retrieve("user");
    console.log(user);
    if (user) {
        return true;
    }
    //TODO: check with server async
    return false;
}

export const getAuthenticatedUser = () => {
    const user = retrieve("user");
    return user;
}