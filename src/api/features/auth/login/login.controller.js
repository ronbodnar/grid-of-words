import { InternalError } from "../../../errors/InternalError.js";
import { UnauthorizedError } from "../../../errors/UnauthorizedError.js";
import { ValidationError } from "../../../errors/ValidationError.js";
import { setCookie } from "../../../shared/helpers.js";
import loginService from "./login.service.js";

/**
 * Performs the login process for the email and password combination provided in the request.
 *
 * Endpoint: /auth/login
 */
const login = async (req, res, next) => {
  const { email, password } = req.body;
  const authToken = req.cookies.token;

  if (!email || !password) {
    return next(new ValidationError("Email and password are required."));
  }

  if (authToken) {
    return next(
      new UnauthorizedError("User already logged in.", {
        authToken: authToken,
      })
    );
  }

  const loginResult = await loginService.login(email, password);
  if (!loginResult) {
    const error = new InternalError(
      "Unexpected login result",
      {
        email: email,
        password: password,
        loginResult: loginResult,
      }
    );
    return next(error);
  }

  if (loginResult instanceof Error) {
    return next(loginResult);
  }

  if (loginResult.token) {
    setCookie(res, "token", loginResult.token);
  }

  // Hide the token from the response object
  delete loginResult.token;

  return res.json(loginResult);
};

export default {
  login,
};
