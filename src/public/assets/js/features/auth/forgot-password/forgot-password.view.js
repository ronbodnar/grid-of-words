import { createButton } from "../../../shared/components/button.js";
import { FormGroup } from "../../form/FormGroup.js";
import { buildForm } from "../../form/form.js";
import { buildView } from "../../view/view.js";

/**
 * Generates all components for the forgot password view (form, headers, nav) and adds them to the content container.
 *
 * @param {string} message An optional message to display when building the view (shows immediately).
 */
export const buildForgotPasswordView = (message) => {
  const formFields = [
    new FormGroup("Email").setType("email").setAutoFocus(true),
  ];
  const formButtons = [
    createButton("Send Email", {
      id: "forgotPassword",
      type: "submit",
    }),
  ];
  const form = buildForm(formFields, formButtons);

  buildView("forgotPassword", {
    header: {
      text: "Forgotten Password?",
    },
    subheader: {
      text: "Enter your email address to receive a password reset link.",
    },
    message: {
      text: message,
      className: "error",
      hidden: true,
      hideDelay: 10000,
    },
    additionalElements: [form],
  });
};
