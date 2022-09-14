import { fetchData } from "../../shared/services/api.service.js"
import { getAuthenticatedUser } from "../auth/authentication.service.js"
import { showView } from "../view/view.service.js"

/**
 * Verifies the authenticated user and fetches the statistics data from the API. Returns home with an error if unsuccessful.
 *
 * @async
 * @returns {Promise<any>} The statistics API response payload.
 */
export const fetchStatistics = async (
  showLoadingViewTimeout,
  redirect = true
) => {
  const authenticatedUser = getAuthenticatedUser()
  if (!authenticatedUser) {
    if (redirect) {
      showView("home", {
        message: {
          text: "You must be logged in to access this page.",
          className: "error",
        },
      })
    }
    clearTimeout(showLoadingViewTimeout)
    return null
  }

  const statisticsResult = await fetchData(
    `users/${authenticatedUser._id}/statistics`
  )
  const { payload, statusCode } = statisticsResult
  if (!payload || statusCode !== 200) {
    if (redirect) {
      showView("home", {
        message: {
          text:
            payload?.message ||
            "Failed to load statistics. Please try again later.",
          className: "error",
        },
      })
    }
    clearTimeout(showLoadingViewTimeout)
    return null
  }
  clearTimeout(showLoadingViewTimeout)
  return payload
}
