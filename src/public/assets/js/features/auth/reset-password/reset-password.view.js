import { createButton } from "../../../shared/components/button.js";
import { FormGroup } from "../../form/FormGroup.js";
import { buildForm } from "../../form/form.js";
import { buildView } from "../../view/view.js";

/**
 * Generates all components for the reset password view (form, header, subheader, nav) and adds them to the content container.
 */
export const buildResetPasswordView = () => {
  // Set up the field, button, and option parameters for the view, then build it.
  const formFields = [
    new FormGroup("New Password").setType("password").setAutoFocus(true),
    new FormGroup("Confirm New Password").setType("password"),
  ];
  const formButtons = [
    createButton("Reset Password", {
      loader: true,
      type: "submit",
    }),
  ];
  const form = buildForm(formFields, formButtons);

  // Build the reset password view with the generated form as an additional element.
  buildView("resetPassword", {
    header: {
      text: "Reset Password",
    },
    subheader: {
      text: "Enter a new password for your account.",
    },
    message: {
      hidden: true,
    },
    additionalElements: [form],
  });
};