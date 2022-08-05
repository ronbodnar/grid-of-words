import { showView } from "../utils/helpers.js";
import { showMessage } from "./message.service.js";
import { store, retrieve } from "./storage.service.js";

export const authenticate = async (user, pass) => {
    const loginButtonLoader = document.querySelector('#loginButtonLoader');
    loginButtonLoader?.classList.remove('hidden');

    console.log("Trying to authenticate", user, pass);
    
    const response = await fetch(`/auth/login/`, {
        method: "POST",
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            username: user,
            password: pass
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