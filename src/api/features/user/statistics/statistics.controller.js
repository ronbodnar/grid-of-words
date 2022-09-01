import ValidationError from "../../../errors/ValidationError.js"
import { getStatistics } from "./statistics.service.js"

/**
 * Handles the request to get statistics for a specific user based on the `userId`
 *
 * Endpoint: GET /users/:id/statistics
 * @async
 */
export const handleGetStatistics = async (req, res, next) => {
  const userId = req.params.id || ""

  if (!userId) {
    return next(new ValidationError("Missing id parameter"))
  }

  const statistics = await getStatistics(userId)
  return res.json(statistics)
}
