import { convertToCamelCase } from "../../../shared/utils/helpers.js"

class Option {
  constructor(title, type, typeOptions) {
    if (!title || type == null || !typeOptions) {
      throw new Error("Option must have a title, type, and type options.", {
        title: title,
        type: type,
        typeOptions: typeOptions,
      })
    }
    this.id = convertToCamelCase(title)
    this.title = title
    this.type = type
    this.typeOptions = typeOptions
  }
}

export default Option
