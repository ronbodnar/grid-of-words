import jwt from "jsonwebtoken";

// Actually not even needed (yet) since we don't want to make users sign in to play.
// I'll just keep it here for now. IT IS NOT USED ANYWHERE!
export const restrict = (req, res, next) => {
  const validJWT = validateJWT(req);
  const validBearer = validateBearer(req);

  // Either bearer auth (API Keys) or token auth (JWT) must be provided.
  if (!validBearer && !validJWT) {
    res.status(401).end({
      error: "User not authenticated",
    });
  }

  // No auth issues, so carry on.
  next();
};

const validateJWT = (req) => {
  const valid = jwt.verify(req?.cookie?.token, process.env.JWT_SECRET);
  return valid;
};

const validateBearer = (req) => {
  const apiKey = req.get("Authorization");
  return apiKey && apiKey === "Bearer " + process.env.BEARER_TOKEN;
};