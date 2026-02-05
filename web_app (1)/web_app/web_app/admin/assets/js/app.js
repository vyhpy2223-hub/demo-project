const ctx = document.getElementById("chart");

new Chart(ctx, {
  type: "line",
  data: {
    labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    datasets: [{
      data: [2, 3, 2.5, 3, 4, 5, 6],
      borderColor: "#6c63ff",
      tension: 0.4,
      fill: false
    }]
  },
  options: {
    plugins: {
      legend: { display: false }
    },
    scales: {
      y: { display: false },
      x: { grid: { display: false } }
    }
  }
});
