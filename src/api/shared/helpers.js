import { generateJWT } from "../features/auth/authentication.service.js";

/**
 * Sets an HttpOnly cookie in the response header. The cookie is secure if NODE_ENV is production.
 *
 * @param {Response} res The express response object.
 * @param {string} name The name of the cookie.
 * @param {any} value The value of the cookie.
 * @param {number} [maxAge=(1000 * 60 * 60 * 24 * 30)] The max age to set for the cookie.
 */
export const setCookie = (
  res,
  name,
  value,
  maxAge = 1000 * 60 * 60 * 24 * 30
) => {
  res.cookie(name, value, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    maxAge: maxAge,
    sameSite: "strict",
  });
};

/**
 * Adds the API key as an HTTPOnly cookie to the response object.
 * @param {Response} res The Express {@link Response} object.
 */
export const setApiKeyCookie = (res) => {
  const apiKeyToken = generateJWT(process.env.API_KEY, "30d");
  setCookie(res, "apiKey", apiKeyToken);
};
