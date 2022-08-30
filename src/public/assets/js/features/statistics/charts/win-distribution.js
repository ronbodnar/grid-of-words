import "../../../chart.umd.js";
import "../../../chartjs-plugin-datalabels.min.js";

export const getWinDistributionChart = (wins) => {
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
  Object.entries(wins).forEach(([key, value]) => (data[key] = value));
  return {
    labels: labels, //Object.keys(wins).map((key) => Number(key) + 3),
    datasets: [
      {
        backgroundColor: "rgba(0, 163, 108, 0.6)",
        data: data, //Object.values(wins),
      },
    ],
  };
};

const getChartOptions = (sumOfWins) => {
  return {
    fill: false,
    indexAxis: "y",
    plugins: {
      tooltip: {
        displayColors: false,
        callbacks: {
          title: function (context) {
            let label = context[0].label || "???";
            const val = Number(label);
            let suffix =
              val === 1 ? "st" : val === 2 ? "nd" : val === 3 ? "rd" : "th";
            return `Wins on the ${label + suffix} attempt`;
          },
          label: function (context) {
            let label = context.formattedValue || "";
            return `${label} Games`;
          },
        },
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
          return `${percent.toFixed(2)}%`;
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
