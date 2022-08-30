import "../../../chart.umd.js";
import "../../../chartjs-plugin-datalabels.min.js";

export const getGameOutcomesChart = (userStatistics) => {
  const { totalGames, wins, losses, abandoned } = userStatistics;
  const sumOfWins = Object.values(wins).reduce((sum, wins) => sum + wins);
  const gameOutcomeContext = document.getElementById("gameOutcomesChart");
  return new Chart(gameOutcomeContext, {
    type: "doughnut",
    data: getChartData(sumOfWins, losses, abandoned),
    options: getChartOptions(totalGames),
    plugins: [ChartDataLabels],
  });
};

const getChartData = (sumOfWins, losses, abandoned) => {
  let labels = ["Win", "Loss", "Abandoned"];
  let data = [sumOfWins, losses, abandoned];
  let backgroundColors = [
    "rgba(0, 163, 108, 0.6)",
    "rgba(227, 34, 39, 0.6)",
    "rgba(89, 96, 109, 0.6)",
  ];
  if (sumOfWins === 0) {
    labels = labels.pop();
    data = data.pop();
    backgroundColors = backgroundColors.pop();
  }
  if (losses === 0) {
    labels = labels.filter((val, index) => index !== 1);
    data = data.filter((val, index) => index !== 1);
    backgroundColors = backgroundColors.filter((val, index) => index !== 1);
  }
  if (abandoned === 0) {
    labels = labels.shift();
    data = data.shift();
    backgroundColors = backgroundColors.shift();
  }
  return {
    labels: labels,
    datasets: [
      {
        backgroundColor: backgroundColors,
        data: data,
        borderWidth: 1,
        borderColor: "transparent",
      },
    ],
  };
};

const getChartOptions = (totalGames) => {
  return {
    hoverOffset: 2,
    cutout: "40%",
    rotation: "-30",
    circumference: "270",
    plugins: {
      tooltip: {
        displayColors: false,
        callbacks: {
          title: function (context) {
            const translations = {
              Win: "Games Won",
              Loss: "Games Lost",
              Abandoned: "Games Abandoned",
            };
            let label = context[0].label || "???";
            return translations[label];
          },
        },
      },
      legend: {
        position: "chartArea",
        labels: {
          color: "rgb(244, 243, 242)",
        },
      },
      datalabels: {
        color: "rgb(244, 243, 242)",
        font: {
          size: 14,
        },
        align: "middle",
        anchor: "end",
        formatter: (value, ctx) => {
          const percent = (value / totalGames) * 100.0;
          if (percent === 0.0) return "";
          return `${percent.toFixed(2)}%`;
        },
      },
    },
    layout: {
      padding: 15,
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
