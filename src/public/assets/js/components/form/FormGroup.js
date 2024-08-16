import { convertToCamelCase } from "../../utils/helpers.js";

export class FormGroup {

    constructor(text, id = undefined, type = "text", required = true, autoFocus = false, message) {
        this.text = text;
        this.type = type;
        this.id = id || convertToCamelCase(text);
        this.required = required;
        this.autoFocus = autoFocus;
        this.message = message;
        return this;
    }

    setText(text) {
        this.text = text;
        return this;
    }

    setId(id) {
        this.id = id;
        return this;
    }

    setType(type) {
        this.type = type;
        return this;
    }

    setRequired(required) {
        this.required = required;
        return this;
    }

    setAutoFocus(autoFocus) {
        this.autoFocus = autoFocus;
        return this;
    }

    setMessage(message) {
        this.message = message;
        return this;
    }
}