import { showView } from "../utils/helpers.js";
import { showMessage } from "./message.service.js";
import {
  storeSession,
  retrieveSession,
  removeSession,
} from "./storage.service.js";

export const authenticate = async (email, password) => {
  const loginButton = document.querySelector("#loginButton");
  if (loginButton) {
    loginButton.disabled = true;
  }

  const submitButtonLoader = document.querySelector("#submitButtonLoader");
  submitButtonLoader?.classList.remove("hidden");

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
  }).catch((err) => {
    console.error(err);
    return null;
  });

  const data = !response ? undefined : await response.json();

  if (!data || data.status === "error") {
    const message = data?.message || "An error has occurred";
    showMessage(message, {
      hide: false,
      className: "error",
    });
    if (loginButton) {
      loginButton.disabled = false;
    }
    submitButtonLoader?.classList.add("hidden");
  } else if (data.success) {
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

  const submitButtonLoader = document.querySelector("#submitButtonLoader");
  submitButtonLoader?.classList.remove("hidden");

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
  }).catch((err) => {
    console.log(err);
    return null;
  });

  const data = !response ? undefined : await response.json();

  console.log("registration response", data);

  if (data?.status === "success") {
    showView("login", {
      message: "Registration successful. Please log in to your account.",
    });
  } else {
    const message = data.message || "An error has occurred";
    showMessage(message, {
      className: "error",
      hide: false,
    });
    if (registerButton) {
      registerButton.disabled = false;
    }
    submitButtonLoader?.classList.add("hidden");
  }
};

export const logoutUser = async () => {
  const response = await fetch(`/auth/logout/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
  }).catch((err) => {
    console.error(err);
    return null;
  });

  const data = !response ? undefined : await response.json();

  if (data && data.status) {
    removeSession("user");
    removeSession("game");
    showView("home");
    showMessage(data.message || "You have been successfully logged out.");
    //window.location.reload(); // Force refresh to clear session data (can this be avoided?)
  } else {
    console.log("Error logging out");
  }
  console.log("Logout response", data);
};

export const changePassword = async (currentPassword, newPassword) => {
  const submitButtonLoader = document.querySelector("#submitButtonLoader");
  const changePasswordButton = document.querySelector("#submitButton");

  if (changePasswordButton) changePasswordButton.disabled = true;
  submitButtonLoader?.classList.remove("hidden");

  const response = await fetch(`/auth/change-password/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      currentPassword: currentPassword,
      newPassword: newPassword,
    }),
  }).catch((err) => {
    console.log(err);
    return null;
  });

  const data = !response ? undefined : await response.json();

  submitButtonLoader?.classList.add("hidden");
  if (changePasswordButton) changePasswordButton.disabled = false;

  return data;
};

export const forgotPasswordResponse = async (email) => {
  const response = await fetch(`/auth/forgot-password/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email: email,
    }),
  }).catch((err) => {
    console.log(err);
    return null;
  });

  const data = await response.json().catch((err) => null)

  return data;
}

export const isAuthenticated = () => {
  const user = retrieveSession("user");
  return user ? true : false;
};

export const getAuthenticatedUser = () => {
  const user = retrieveSession("user");
  return user;
};
