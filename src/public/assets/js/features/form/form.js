import { handleClickEvent } from "../../shared/services/event.service.js";
import { createInput } from "./input.js";
import { createLabel } from "./label.js";

// TODO: add columns for grid layouts

/*
 * Options:
 *  - submessage (string)
 */
export const buildForm = (inputGroups, buttons, options) => {
  options = options || {};

  if (!inputGroups || !Array.isArray(inputGroups)) {
    console.error("Fields must be an array");
    return;
  }

  // Set up the basic form structure and disable form submission events.
  const form = document.createElement("form");
  form.classList.add("form");
  form.id = options.id; // this can be undefined
  form.onsubmit = () => {
    return false;
  };

  // Generate the label / input field pairs for each field and add them to the form.
  for (let i = 0; i < inputGroups.length; i++) {
    const group = inputGroups[i];
    if (!group) {
      console.error("Invalid field provided");
      continue;
    }

    const label = createLabel(group.text);
    const input = createInput(group.text, {
      type: group.type,
    });

    form.appendChild(label);
    form.appendChild(input);

    // Add a submessage element under the input field and add it to the form.
    if (group.message) {
      const inputMessageDiv = document.createElement("p");
      inputMessageDiv.style.textAlign = "start";
      inputMessageDiv.classList.add("submessage");
      inputMessageDiv.innerHTML = group.message;
      inputMessageDiv.addEventListener("click", handleClickEvent);
      inputMessageDiv.style.marginTop = "0";
      form.appendChild(inputMessageDiv);
    }
  }

  // Generate the buttons
  for (let i = 0; i < buttons.length; i++) {
    const button = buttons[i];
    button.style.marginTop = "10px";
    console.log(button);
    form.appendChild(button);
  }

  // Create a submessage element, set the text and add the global click handler.
  if (options.submessage) {
    const submessageDiv = document.createElement("p");
    submessageDiv.classList.add("submessage");
    submessageDiv.innerHTML = options.submessage;
    submessageDiv.addEventListener("click", handleClickEvent);
    form.appendChild(submessageDiv);
  }

  return form;
};
