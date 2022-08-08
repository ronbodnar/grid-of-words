import { verifyToken } from "../services/authentication.service.js";

export const requireToken = (req, res, next) => {
  if (!verifyToken(req?.cookies?.token)) {
    return res.status(401).json({
      status: "error",
      message: "Missing or expired token.",
    })
  }

  // No auth issues, so carry on.
  next();
}