import { showView } from "../../services/view.service.js";
import { showMessage } from "../../services/message.service.js";
import { retrieveSession, removeSession } from "../../services/storage.service.js";
import { fetchData } from "../../utils/helpers.js";

export const submitAuthForm = async (url, params, successFn, failureFn) => {
  // Find the submit button on the current view.
  const submitButton = document.querySelector("button[type='submit']");
  const submitButtonLoader = document.querySelector("#submitButtonLoader");

  // Disable the button and show the button loader.
  if (submitButton) {
    submitButton.disabled = true;
  }
  submitButtonLoader?.classList.remove("hidden");

  // Fetch the response from the server.
  const responsePromise = await fetchData(url, "POST", params);

  console.log("submitAuthForm responsePromise", responsePromise);

  // Validate the response and statusCode to handle any errors.
  // Invalid responses will display an error message, re-enable the form, then invoke an optional failureFn callback.
  if (!responsePromise || responsePromise.statusCode !== 200) {
    // Enable the submit button and hide the button loader.
    if (submitButton) {
      submitButton.disabled = false;
    }
    submitButtonLoader?.classList.add("hidden");

    showMessage(
      responsePromise?.message || "An error has occurred. Please try again.",
      {
        className: "error",
        hide: false,
      }
    );

    // Call the optional failureFn callback with the response data if available.
    if (failureFn) {
      failureFn(responsePromise);
    }
    return;
  }

  // Enable the submit button and hide the button loader.
  if (submitButton) {
    submitButton.disabled = false;
  }
  submitButtonLoader?.classList.add("hidden");

  // Call the successFn callback with the response data.
  if (successFn) {
    successFn(responsePromise);
  }
};

export const logout = async () => {
  const data = await fetchData("/auth/logout", "POST");

  if (data && data.statusCode === 200) {
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

export const validateResetToken = async (passwordResetToken) => {
  const response = await fetch(`/auth/validate/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      passwordResetToken: passwordResetToken,
    }),
  }).catch((err) => {
    console.log(err);
    return null;
  });

  const data = await response.json().catch((err) => {
    console.error("Error parsing json response", err);
    return null;
  });

  return data;
};

export const isAuthenticated = () => {
  const user = retrieveSession("user");
  return user ? true : false;
};

export const getAuthenticatedUser = () => {
  const user = retrieveSession("user");
  return user;
};

export { changePassword } from "./change-password/change-password.js";
export { resetPassword } from "./reset-password/reset-password.js";
export { forgotPassword } from "./forgot-password/forgot-password.js";
export { login } from "./login/login.js";
export { register } from "./register/register.js";