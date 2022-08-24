import { convertToCamelCase } from "../../shared/utils/helpers.js";

export const createLabel = (text) => {
  const label = document.createElement("label");
  label.htmlFor = convertToCamelCase(text);
  label.textContent = text;

  return label;
};
