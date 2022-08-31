import { buildView } from "../view/view.js";
import { createText } from "../../shared/components/text.js";
import { loadGameOutcomesChart } from "./charts/game-outcomes.js";
import { loadWinDistributionChart } from "./charts/win-distribution.js";
import { showView } from "../view/view.service.js";
import { fetchStatistics } from "./statistics.service.js";

/**
 * Builds and displays the statistics view within the content container and loads all charts into their canvas.
 */
export const buildStatisticsView = async (options) => {
  let { statistics } = options;
  if (!statistics) {
    showView("loading");

    // fetchStatistics handles errors by redirecting so we can just return early.
    statistics = await fetchStatistics();
    if (!statistics) {
      return;
    }
  }

  const { totalGames, wins, winStreak, bestWinStreak } = statistics;

  buildView("statistics", {
    header: {
      text: "Game Statistics",
      styles: {
        marginBottom: "10px",
      },
    },
    subheader: {
      text: `You've played a total of <span class="total-games-stats">${totalGames}</span> games`,
      hide: false,
      styles: {
        fontSize: "20px",
        fontWeight: "bold",
      },
    },
    hasNavigationButton: true,
    additionalElements: [
      buildStreakContainer(winStreak, bestWinStreak),
      buildChartContainer("gameOutcomesChart", 300, 300),
      getWinDistributionHeader(),
      buildChartContainer("winDistributionChart", 300, 150),
      getHoverMessage(),
    ],
  });

  loadGameOutcomesChart(statistics);
  loadWinDistributionChart(wins);
};

const getHoverMessage = () => {
  return createText({
    type: "submessage",
    text: "Hover over or tap the charts to see percentages.",
    styles: {
      marginTop: "10px",
      fontSize: "12px",
      fontStyle: "italic",
    },
  });
};

/**
 * Creates a text element that represents the win distribution header.
 *
 * @returns {HTMLParagraphElement} The text element.
 */
const getWinDistributionHeader = () => {
  return createText({
    type: "subheader",
    text: "Win Distribution by Attempt",
    styles: {
      fontSize: "20px",
      fontWeight: "bold",
      marginTop: "30px",
    },
  });
};

/**
 * Builds a flex container for win streak and best win streak with 50% width (2 stats per row).
 *
 * @param {*} winStreak The value of the user's current win streak.
 * @param {*} bestWinStreak The value of the user's best win streak.
 * @returns {HTMLDivElement} The streak container element populated with textValues.
 */
const buildStreakContainer = (winStreak, bestWinStreak) => {
  const streakContainer = document.createElement("div");
  streakContainer.classList.add("streak-container");

  const textValues = [
    winStreak,
    "Current Streak",
    bestWinStreak,
    "Best Streak",
  ];

  // Create containers for the elements equal to half the elementText array
  for (let i = 0; i < textValues.length; i += 2) {
    const container = document.createElement("div");
    container.style.width = "50%";

    // Create 2 side-by-side text elements per container
    for (let j = i; j < i + 2; j++) {
      const options = {
        type: "submessage",
        text: textValues[j],
        emitClickEvent: false,
        styles: {
          fontSize: j % 2 === 0 ? "20px" : "16px", // Make value text bigger to stand out more
          fontWeight: "bold",
        },
      };
      const textElement = createText(options);
      container.appendChild(textElement);
    }

    streakContainer.appendChild(container);
  }

  return streakContainer;
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
