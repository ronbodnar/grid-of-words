import { convertToCamelCase } from "../../shared/utils/helpers.js";

/**
 * Represents a form group with various properties like text, type, id, etc.
 */
export class FormGroup {
  
  /**
   * Creates an instance of FormGroup.
   *
   * @constructor
   * @param {string} text - The label text for the form group.
   * @param {string} [id=undefined] - The id of the form group, defaults to a camelCase conversion of the text.
   * @param {string} [type='text'] - The type of input field, defaults to 'text'.
   * @param {boolean} [required=true] - Whether the input is required, defaults to true.
   * @param {boolean} [autoFocus=false] - Whether the input should be auto-focused, defaults to false.
   * @param {string} [message] - An optional message associated with the form group.
   */
  constructor(
    text,
    id = undefined,
    type = "text",
    required = true,
    autoFocus = false,
    message
  ) {
    this.text = text;
    this.type = type;
    this.id = id || convertToCamelCase(text);
    this.required = required;
    this.autoFocus = autoFocus;
    this.message = message;
    return this;
  }

  /**
   * Sets the text for the form group.
   *
   * @param {string} text - The new text for the form group.
   * @returns {FormGroup} The current FormGroup instance.
   */
  setText(text) {
    this.text = text;
    return this;
  }

  /**
   * Sets the id for the form group.
   *
   * @param {string} id - The new id for the form group.
   * @returns {FormGroup} The current FormGroup instance.
   */
  setId(id) {
    this.id = id;
    return this;
  }

  /**
   * Sets the type for the form group.
   *
   * @param {string} type - The new type for the form group.
   * @returns {FormGroup} The current FormGroup instance.
   */
  setType(type) {
    this.type = type;
    return this;
  }

  /**
   * Sets the required attribute for the form group.
   *
   * @param {boolean} required - Whether the form group should be required.
   * @returns {FormGroup} The current FormGroup instance.
   */
  setRequired(required) {
    this.required = required;
    return this;
  }

  /**
   * Sets the autoFocus attribute for the form group.
   *
   * @param {boolean} autoFocus - Whether the form group should auto-focus.
   * @returns {FormGroup} The current FormGroup instance.
   */
  setAutoFocus(autoFocus) {
    this.autoFocus = autoFocus;
    return this;
  }

  /**
   * Sets the message for the form group.
   *
   * @param {string} message - The new message for the form group.
   * @returns {FormGroup} The current FormGroup instance.
   */
  setMessage(message) {
    this.message = message;
    return this;
  }
}
