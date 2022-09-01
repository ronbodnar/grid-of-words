import { showMessage } from "../../shared/services/message.service.js"
import OPTIONS from "./enums/options.js"

export const saveOptions = () => {
    Object.keys(OPTIONS).forEach((key) => {
        const option = OPTIONS[key];
        const optionContainer = document.querySelector(`#${option.id}-container`);
        const value = optionContainer.firstChild.value;
        console.log(`${option.title} value: ${value}`);
    })
  showMessage("Settings saved successfully", {
    className: "success",
    hide: true,
  })
}