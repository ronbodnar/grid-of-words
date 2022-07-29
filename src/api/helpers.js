/*
 * Uses a regular expression to validate a string against the UUID string format.
 *
 * @param {string} uuidString - The string to validate.
 * @return {boolean} true if the string is a valid UUID string, false otherwise.
 */
export const isUUID = (uuidString) => {
    const pattern = /[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/;
    return pattern.test(uuidString);
}