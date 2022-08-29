import { buildView } from "../view/view.js";

/**
 * Builds and displays a loading view within the content container.
 */
export const buildStatisticsView = () => {
  buildView("statistics", {
    header: {
        text: "Game Statistics"
    },
    hasNavigationButton: true,
  });
};