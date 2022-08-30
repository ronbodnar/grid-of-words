import { buildView } from "../view/view.js";
import "../../chart.umd.js";
import "../../chartjs-plugin-datalabels.min.js";

/**
 * Builds and displays a loading view within the content container.
 */
export const buildStatisticsView = () => {
  buildView("statistics", {
    header: {
      text: "Game Statistics",
    },
    message: {
      text: "You've played a total of 170 games",
      hide: false,
    },
    hasNavigationButton: true,
    additionalElements: [buildGameOutcomeGraph()],
  });
  loadCharts();
};

const buildGameOutcomeGraph = () => {
  const outcomeGraphDiv = document.createElement("div");
  outcomeGraphDiv.style.width = "325px";
  outcomeGraphDiv.style.height = "325px";

  const ctx = document.createElement("canvas");
  ctx.id = "gameOutcomeChart";

  outcomeGraphDiv.appendChild(ctx);
  return outcomeGraphDiv;
};

const loadCharts = () => {
  const ctx = document.getElementById("gameOutcomeChart");
  new Chart(ctx, {
    type: "doughnut",
    data: {
      labels: ["Win", "Loss", "Abandon"],
      datasets: [
        {
          backgroundColor: ['rgba(0, 163, 108, 0.6)', 'rgba(227, 34, 39, 0.6)', 'rgba(89, 96, 109, 0.6)'],
          data: [150, 13, 7],
          borderWidth: 0,
          borderColor: 'transparent',
        },
      ],
    },
    plugins: [ChartDataLabels],
    options: {
      cutout: "40%",
      rotation: '-50',
      circumference: '270',
      plugins: {
        legend: {
          position: 'chartArea',
          labels: {
            color: '#fff'
          },
        },
        datalabels: {
          color: "#fff",
          font: {
            size: 14,
          },
          align: "start",
          anchor: "end",
          formatter: (value, ctx) => {
            const percent = value / 170 * 100.0;
            console.log(value);
            return `${percent.toFixed(2)}%`;
          },
        },
      },
      scales: {
        y: {
          ticks: {
            display: false,
          },
        },
      },
    },
  });
};
