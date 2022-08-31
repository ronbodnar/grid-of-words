import { fetchData } from "../../shared/services/api.service.js";
import { getAuthenticatedUser } from "../auth/authentication.service.js";
import { showView } from "../view/view.service.js";

/**
 * Verifies the authenticated user and fetches the statistics data from the API. Returns home with an error if unsuccessful.
 *
 * @returns The statistics API response payload.
 */
export const fetchStatistics = async (redirect = true) => {
  const authenticatedUser = getAuthenticatedUser();
  if (!authenticatedUser) {
    if (redirect) {
      showView("home", {
        message: {
          text: "You must be logged in to access this page.",
          className: "error",
        },
      });
    }
    return null;
  }

  // Fetch the statistics data from the server. The server determines the authenticated user so we don't pass it.
  const statisticsResult = await fetchData(`/statistics`);
  if (!statisticsResult?.payload || statisticsResult.statusCode !== 200) {
    if (redirect) {
      showView("home", {
        message: {
          text: "Failed to load statistics. Please try again later.",
          className: "error",
        },
      });
    }
    return null;
  }
  return statisticsResult.payload;
};
