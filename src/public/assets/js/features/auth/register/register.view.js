import { createButton } from "../../../shared/components/button.js";
import { FormGroup } from "../../form/FormGroup.js";
import { buildForm } from "../../form/form.js";
import { buildView } from "../../navigation/view.js";

/**
 * Generates all components for the registration view (form, headers, nav) and adds them to the content container.
 */
export const buildRegisterView = () => {
  // Set up the field, button, and option parameters for the view, then build it.
  const formFields = [
    new FormGroup("Email").setAutoFocus(true),
    new FormGroup("Username"),
    new FormGroup("Password").setType("password"),
    new FormGroup("Confirm Password").setType("password"),
  ];
  const formButtons = [
    createButton("Register", {
      loader: true,
      type: "submit",
    }),
  ];
  const formOptions = {
    submessage: "<a id='showLogin'>Already have an account?</a>",
  };

  // Build the registration form and then generate the view
  const form = buildForm(formFields, formButtons, formOptions);

  buildView("register", {
    header: "Register Account",
    hasNavigationButton: true,
    additionalElements: [form],
    message: {},
  });
};
