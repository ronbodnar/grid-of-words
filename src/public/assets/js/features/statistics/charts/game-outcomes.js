import "../../../chart.umd.js"
import "../../../chartjs-plugin-datalabels.min.js"

export const loadGameOutcomesChart = (userStatistics) => {
  const gameOutcomeContext = document.getElementById("gameOutcomesChart")
  return new Chart(gameOutcomeContext, {
    type: "doughnut",
    data: getChartData(userStatistics),
    options: getChartOptions(),
    plugins: [
      ChartDataLabels,
      {
        // Increases padding between the chart and the legend by increasing the legend height.
        beforeInit: function (chart) {
          const originalFit = chart.legend.fit
          chart.legend.fit = function fit() {
            originalFit.bind(chart.legend)()
            this.height += 20
          }
        },
      },
    ],
  })
}

const getChartData = (userStatistics) => {
  const { totalGames, wins, losses, abandoned } = userStatistics
  const sumOfWins = !(wins.length > 0)
    ? 0
    : Object.values(wins).reduce((sum, wins) => sum + wins)

  let labels = ["Win", "Loss", "Abandon"]
  let data = [sumOfWins + 20, losses + 20, abandoned + 20] // 20 added to each to manipulate the minimum slice size
  let backgroundColors = [
    "rgba(0, 163, 108, 0.6)",
    "rgba(227, 34, 39, 0.6)",
    "rgba(49, 56, 79, 0.6)",
  ]

  if (losses === 0) {
    labels = labels.filter((_, i) => i !== 1)
    data = data.filter((_, i) => i !== 1)
    backgroundColors = backgroundColors.filter((_, i) => i !== 1)
  }
  if (sumOfWins === 0) {
    labels.shift()
    data.shift()
    backgroundColors.shift()
  }
  if (abandoned === 0) {
    labels.pop()
    data.pop()
    backgroundColors.pop()
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
            percent: {
              anchor: "end",
              align: "middle",
              color: "rgba(220, 219, 218, 0.9)",
              font: {
                size: 14,
              },
              formatter: (value, ctx) => {
                // Remove the extra 20 that was added to manipulate minimum slice sizes.
                value = value - 20

                const percent = (value / totalGames) * 100.0
                if (percent <= 0 || percent > 100) return null
                return ctx?.active ? `${percent.toFixed(2)}%` : null
              },
            },
            value: {
              offset: 25,
              anchor: "end",
              align: "start",
              font: {
                size: 16,
                weight: "bold",
              },
              formatter: (value, ctx) => {
                value = value - 20
                return value.toLocaleString()
              },
            },
          },
        },
      },
    ],
  }
}

const getChartOptions = () => {
  return {
    hoverOffset: 3,
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
        left: 5,
        right: 5,
        bottom: 5,
      },
    },
    scales: {
      y: {
        ticks: {
          display: false,
        },
      },
    },
  }
}
