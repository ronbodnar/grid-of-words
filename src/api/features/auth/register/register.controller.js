import { InternalError, ValidationError } from "../../../errors/index.js";
import { registerService } from "./index.js";

export const register = async (req, res, next) => {
  const { email, password, username } = req.body;

  if (!username || !email || !password) {
    return next(
      new ValidationError("Missing required fields: username, email, password")
    );
  }

  const registerResult = await registerService.register(
    username,
    email,
    password
  );
  if (!registerResult) {
    return next(
      new InternalError("Unexpected error while registering user", {
        username: username,
        email: email,
      })
    );
  }
  if (registerResult instanceof Error) {
    return next(registerResult);
  }
  return res.json(registerResult);
};
