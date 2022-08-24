import { createButton } from "../../../shared/components/button.js";
import { FormGroup } from "../../formbuilder/FormGroup.js";
import { buildForm } from "../../formbuilder/formbuilder.js";
import { buildView } from "../../view/view.js";

/**
 * Generates all components for the registration view (form, headers, nav) and adds them to the content container.
 */
export const buildRegisterView = () => {
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
  const form = buildForm(formFields, formButtons, formOptions);

  buildView("register", {
    header: {
      text: "Register Account",
    },
    message: {},
    additionalElements: [form],
  });
};
