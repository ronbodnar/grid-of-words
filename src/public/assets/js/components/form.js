export const buildForm = (options) => {
  options = options || {};

  /*
   * Options:
   *  - message (string)
   *  - showMessage (boolean)
   *  - submessage (string)
   *  - showSubmessage (boolean)
   *  - inputGroups (object array)
   *  - buttons (object array) (of buttons)
   */

  // Set up the basic form structure and disable form submission events.
  const form = document.createElement("form");
  form.classList.add("form");
  form.onsubmit = () => {
    return false;
  };

  return form;
};
