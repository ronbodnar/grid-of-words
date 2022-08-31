import "../../../chart.umd.js";
import "../../../chartjs-plugin-datalabels.min.js";

export const loadGameOutcomesChart = (userStatistics) => {
  const gameOutcomeContext = document.getElementById("gameOutcomesChart");
  return new Chart(gameOutcomeContext, {
    type: "doughnut",
    data: getChartData(userStatistics),
    options: getChartOptions(),
    plugins: [
      ChartDataLabels,
      {
        // Increases padding between the chart and the legend by increasing the legend height.
        beforeInit: function (chart) {
          const originalFit = chart.legend.fit;
          chart.legend.fit = function fit() {
            originalFit.bind(chart.legend)();
            this.height += 20;
          };
        },
      },
    ],
  });
};

const getChartData = (userStatistics) => {
  const { totalGames, wins, losses, abandoned } = userStatistics;
  const sumOfWins = Object.values(wins).reduce((sum, wins) => sum + wins);

  let labels = ["Win", "Loss", "Abandon"];
  let data = [sumOfWins, losses, abandoned];
  let backgroundColors = [
    "rgba(0, 163, 108, 0.6)",
    "rgba(227, 34, 39, 0.6)",
    "rgba(49, 56, 79, 0.6)",
  ];

  if (losses === 0) {
    labels = labels.filter((_, i) => i !== 1);
    data = data.filter((_, i) => i !== 1);
    backgroundColors = backgroundColors.filter((_, i) => i !== 1);
  }
  if (sumOfWins === 0) {
    labels.shift();
    data.shift();
    backgroundColors.shift();
  }
  if (abandoned === 0) {
    labels.pop();
    data.pop();
    backgroundColors.pop();
  }

  return {
    labels: labels,
    datasets: [
      {
        backgroundColor: backgroundColors,
        data: data,
        borderWidth: 3,
        borderColor: "#0d1117",
        datalabels: {
          labels: {
            value: {
              offset: -4,
              align: "end",
              anchor: "end",
              font: {
                size: 16,
              },
              formatter: (value, ctx) => {
                const percent = (value / (totalGames + 100)) * 100.0;
                if (percent <= 0 || percent > 100) return "";
                return ctx.active ? `${percent.toFixed(1)}%` : value;
              },
            },
          },
        },
      },
    ],
  };
};

const getChartOptions = () => {
  return {
    hoverOffset: 6,
    cutout: "25%",
    rotation: "-30",
    circumference: "360",
    plugins: {
      tooltip: {
        enabled: false,
      },
      legend: {
        display: true,
        position: "top",
        labels: {
          boxWidth: 30,
          color: "rgb(244, 243, 242)",
        },
      },
      datalabels: {
        color: "rgb(244, 243, 242)",
        font: {
          size: 14,
        },
      },
    },
    layout: {
      padding: {
        left: 20,
        right: 20,
        bottom: 20,
      },
    },
    scales: {
      y: {
        ticks: {
          display: false,
        },
      },
    },
  };
};
