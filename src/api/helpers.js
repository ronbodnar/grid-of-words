/*
 * Uses a regular expression to validate a string against the UUID string format.
 *
 * @param {string} uuidString - The string to validate.
 * @return {boolean} true if the string is a valid UUID string, false otherwise.
 */
export const isUUID = (uuidString) => {
  const pattern =
    /[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/;
  return pattern.test(uuidString);
};

export const setCookie = (res, name, value, maxAge = 1000 * 60 * 60 * 24 * 30) => {
  res.cookie(name, value, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    maxAge: maxAge,
    sameSite: "strict",
  });
};