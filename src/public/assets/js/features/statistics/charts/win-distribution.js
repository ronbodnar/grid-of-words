import "../../../chart.umd.js";
import "../../../chartjs-plugin-datalabels.min.js";

export const loadWinDistributionChart = (wins) => {
  const sumOfWins = Object.values(wins).reduce((sum, w) => sum + w);
  const winDistributionContext = document.getElementById(
    "winDistributionChart"
  );
  return new Chart(winDistributionContext, {
    type: "bar",
    data: getChartData(wins),
    options: getChartOptions(sumOfWins),
    plugins: [ChartDataLabels],
  });
};

const getChartData = (wins) => {
  const labels = Array.from({ length: 6 }, (_, i) => i + 1);

  // Add wins for custom games only if they're present.
  if (wins[7]) {
    labels.push(7);
  }
  if (wins[8]) {
    labels.push(8);
  }

  const data = new Array(labels.length).fill(0);

  // Populate the data array with the number of wins for each game length. Subtract 1 to match 0 index.
  Object.entries(wins).forEach(([key, value]) => (data[Number(key) - 1] = value));

  return {
    labels: labels,
    datasets: [
      {
        backgroundColor: "rgba(0, 163, 108, 0.6)",
        data: data,
      },
    ],
  };
};

const getChartOptions = (sumOfWins) => {
  return {
    indexAxis: "y",
    plugins: {
      tooltip: {
        enabled: false,
      },
      legend: {
        display: false,
      },
      datalabels: {
        color: "rgb(244, 243, 242)",
        font: {
          size: 14,
        },
        align: "end",
        anchor: "end",
        formatter: (value, ctx) => {
          const percent = (value / sumOfWins) * 100.0;
          return ctx?.active ? `${percent.toFixed(1)}%` : value;
        },
      },
    },
    layout: {
      padding: {
        right: 60,
      },
    },
    scales: {
      y: {
        ticks: {
          color: "rgb(244, 243, 242)",
          beginAtZero: true,
        },
      },
      x: {
        ticks: {
          color: "rgb(244, 243, 242)",
        },
        grid: {
          color: "rgba(244, 243, 242, 0.1)",
        },
      },
    },
  };
};
