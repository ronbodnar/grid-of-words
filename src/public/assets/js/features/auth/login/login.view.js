import { createButton } from "../../../shared/components/button.js";
import { FormGroup } from "../../form/FormGroup.js";
import { buildForm } from "../../form/form.js";
import { buildView } from "../../view/view.js";

/**
 * Generates all components for the login view (form, headers, nav) and adds them to the content container.
 *
 * @param {string} message An optional message to display when building the view (shows immediately).
 */
export const buildLoginView = (message) => {
  const formFields = [
    new FormGroup("Email").setAutoFocus(true),
    new FormGroup("Password")
      .setType("password")
      .setMessage(
        "<a class='form-link' id='showForgotPassword'>Forgot password?</a>"
      ),
  ];
  const formButtons = [
    createButton("Login", {
      loader: true,
      type: "submit",
    }),
  ];
  const formOptions = {
    submessage:
      "<a class='form-link' id='showRegister'>Don't have an account?</a>",
  };
  const form = buildForm(formFields, formButtons, formOptions);

  buildView("login", {
    header: {
      text: "Account Login",
    },
    message: {
      text: message,
      className: "success",
      hidden: false,
    },
    additionalElements: [form],
  });
};
