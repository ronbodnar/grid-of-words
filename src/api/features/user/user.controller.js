import UnauthorizedError from "../../errors/UnauthorizedError.js";
import { getAuthenticatedUser } from "../auth/authentication.service.js";
import { getStatistics } from "./user.service.js";

//TODO: /users/:id/statistics
export const handleGetStatistics = async (req, res, next) => {
  const authToken = req.cookies.token || "";
  const authenticatedUser = await getAuthenticatedUser(authToken);
  if (!authenticatedUser) {
    return next(new UnauthorizedError("User not authenticated"));
  }
  const statistics = await getStatistics(authenticatedUser);
  return res.json(statistics);
};
