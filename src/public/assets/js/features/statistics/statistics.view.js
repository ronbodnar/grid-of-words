import { buildView } from "../view/view.js";
import { createText } from "../../shared/components/text.js";
import { getGameOutcomesChart } from "./charts/game-outcomes.js";
import { getWinDistributionChart } from "./charts/win-distribution.js";
import { getAuthenticatedUser } from "../auth/authentication.service.js";
import { showView } from "../view/view.service.js";
import { loadStatistics } from "../../shared/services/api.service.js";

/**
 * Builds and displays the statistics view within the content container and loads all charts into their canvas.
 */
export const buildStatisticsView = async () => {
  showView("loading");
  
  const statistics = await loadStatistics();
  if (!statistics) {
    showView("home", {
      message: {
        text: "Failed to load statistics. Please try again later.",
        hide: false,
        className: "error",
      },
    });
    return;
  }

  const { totalGames, wins } = statistics;

  const distributionHeader = createText({
    type: "subheader",
    text: "Win Distribution by Attempt",
    styles: {
      fontSize: "20px",
      fontWeight: "bold",
      marginTop: "40px",
    },
  });

  buildView("statistics", {
    header: {
      text: "Game Statistics",
    },
    message: {
      text: `You've played a total of ${totalGames} games`,
      hide: false,
    },
    hasNavigationButton: true,
    additionalElements: [
      buildChartContainer("gameOutcomesChart", 300, 300),
      distributionHeader,
      buildChartContainer("winDistributionChart", 300, 150),
    ],
  });

  const gameOutcomesChart = getGameOutcomesChart(statistics);
  const winDistributionChart = getWinDistributionChart(wins);
};

/**
 * Builds a canvas div container for charts/graphs.
 * 
 * @param {*} id The id to assign the canvas.
 * @param {*} width The width of the canvas parent container.
 * @param {*} height The height of the canvas parent container.
 * @returns {HTMLDivElement} The build chart container element with a blank canvas.
 */
const buildChartContainer = (id, width, height) => {
  const graphContainer = document.createElement("div");
  graphContainer.style.width = width + "px";
  graphContainer.style.height = height + "px";

  const ctx = document.createElement("canvas");
  ctx.id = id;

  graphContainer.appendChild(ctx);
  return graphContainer;
};
