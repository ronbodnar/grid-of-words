import { createButton } from "../../../shared/components/button.js";
import { FormGroup } from "../../form/FormGroup.js";
import { buildForm } from "../../form/form.js";
import { buildView } from "../../view/view.js";

/**
 * Generates all components for the change password view (form, headers, nav) and adds them to the content container.
 */
export const buildChangePasswordView = () => {
  const formFields = [
    new FormGroup("Current Password").setType("password").setAutoFocus(true),
    new FormGroup("New Password").setType("password"),
    new FormGroup("Confirm New Password").setType("password"),
  ];
  const formButtons = [
    createButton("Change Password", {
      type: "submit",
    }),
  ];
  const form = buildForm(formFields, formButtons);

  buildView("changePassword", {
    header: {
      text: "Change Password",
    },
    subheader: {
      text: "Enter your current password and a new password to change your password.",
    },
    message: {},
    additionalElements: [form],
  });
};