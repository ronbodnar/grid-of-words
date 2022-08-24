import { convertToCamelCase } from "../../shared/utils/helpers.js";

export const createInput = (fieldName, options) => {
  options = options || {};

  const input = document.createElement("input");
  input.type = options.type || "text";
  input.placeholder = fieldName || "";
  input.required = options.required || true;
  input.id = options.id || convertToCamelCase(fieldName);

  return input;
};
