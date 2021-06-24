import React, { useState, useEffect } from "react";
import { Line } from "react-chartjs-2";

const buildChartData = (data, casesType = "cases") => {
  let chartData = [];
  let lastData;
  for (let date in data.cases) {
    if (lastData) {
      let newdata = {
        x: date,
        y: data[casesType][date] - lastData,
      };
      chartData.push(newdata);
    }
    lastData = data[casesType][date];
  }
  return chartData;
};

function LineGraph({ casesType }) {
  const [data, setData] = useState({});

  useEffect(() => {
    const arr = async () => {
      const response = await fetch(
        "https:disease.sh/v3/covid-19/historical/all?lastdays=120"
      );
      const jsonResponse = await response.json();
      const chartData = buildChartData(jsonResponse, casesType);
      setData(chartData);
    };
    arr();
  }, [casesType]);

  return (
    <div>
      {data && data.length > 0 && (
        <Line
          className="graph"
          data={{
            datasets: [
              {
                backgroundColor: "rgba(204,16,52,0.5)",
                borderColor: "#CC1034",
                data: data,
              },
            ],
          }}
        />
      )}
    </div>
  );
}

export default LineGraph;
