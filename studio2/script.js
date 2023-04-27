let globalData;
let myChart = null; 

const getData = async () => {
  const response = await fetch("db.json");
  const data = await response.json();
  globalData = data.dates;
};

const main = async (type) => {
  await getData();

  if (myChart) {
    myChart.destroy();
  }

  myChart = new Chart("myChart", {
    type: type,
    data: {
      labels: Object.keys(globalData),
      datasets: [
        {
          label: "Miles Walked",
          backgroundColor: "wheat",
          data: Object.values(globalData),
        },
      ],
    },
    options: {},
  });

  console.log(globalData);
};


  let chartType = "";  

  document.querySelector("#formatButton").addEventListener("click", () => {
    chartType = chartType === "bar" ? "line" : "bar"; 
    main(chartType);
  });

  main("line");
