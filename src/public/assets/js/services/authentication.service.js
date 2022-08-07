import { showView } from "../utils/helpers.js";
import { showMessage } from "./message.service.js";
import { storeSession, retrieveSession, removeSession } from "./storage.service.js";

export const authenticate = async (email, password) => {
  const loginButton = document.querySelector("#loginButton");
  if (loginButton) {
    loginButton.disabled = true;
  }

  const loginButtonLoader = document.querySelector("#loginButtonLoader");
  loginButtonLoader?.classList.remove("hidden");

  console.log("Trying to authenticate", email, password);

  const response = await fetch(`/auth/login/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email: email,
      password: password,
    }),
  }).catch((err) => console.log(err));

  const data = await response.json();

  if (data.status === "success") {
  } else {
    const message = data.message || "An error has occurred";
    showMessage(message, false);
    if (loginButton) {
      loginButton.disabled = false;
    }
    loginButtonLoader?.classList.add("hidden");
  }

  if (data.user) {
    storeSession("user", data.user);
    showView("home");
  }

  console.log("authenticate response", data);
};

export const register = async (email, username, password) => {
  const registerButton = document.querySelector("#registerButton");
  if (registerButton) registerButton.disabled = true;

  const registerButtonLoader = document.querySelector("#registerButtonLoader");
  registerButtonLoader?.classList.remove("hidden");

  console.log("Trying to register", email, username, password);

  const response = await fetch(`/auth/register/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email: email,
      username: username,
      password: password,
    }),
  }).catch((err) => console.log(err));

  const data = await response.json();

  console.log("registration response", data);

  if (data?.status === "success") {
    showView("login", {
      success: true,
    });
  } else {
    const message = data.message || "An error has occurred";
    showMessage(message, false);
    if (registerButton) {
      registerButton.disabled = false;
    }
    registerButtonLoader?.classList.add("hidden");
  }
};

export const logoutUser = async () => {
  const response = await fetch(`/auth/logout/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
  });

  const data = await response.text();

  removeSession("user");
  removeSession("game");

  console.log("Logout response", data);
}

export const isAuthenticated = () => {
  const user = retrieveSession("user");
  return user ? true : false;
};

export const getAuthenticatedUser = () => {
  const user = retrieveSession("user");
  return user;
};
