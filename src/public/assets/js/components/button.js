export const createButton = (text, id, options) => {
  // Set up options and button attributes.
  options = options || {};
  const type = options.type || "button";
  const classes = options.classes || ["button", "fixed"];

  // Build the button element with the specified attributes.
  const button = document.createElement("button");
  button.id = id + "Button";
  button.type = type;

  // Add all of the classes to the button element.
  for (const c in classes) {
    button.classList.add(classes[c]);
  }
  
  // If imagePath is present, show the image before the text on the button.
  // Otherwise, just set the text content.
  if (options.icon) {
    button.innerHTML = `<img src='/assets/material-icons/${options.icon}.svg' style='vertical-align: -6px'> ${text}`;
  } else {
    button.textContent = text;
  }

  if (options.loader) {
    button.innerHTML += "<span class='button-loader hidden' id='submitButtonLoader'</span>";
  }

  button.addEventListener("click", (event) => handleButtonClick(event, options.eventArgs));

  return button;
};
