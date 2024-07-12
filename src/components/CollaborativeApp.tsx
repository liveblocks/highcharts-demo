"use client";

import { Chart } from "./Chart";
import styles from "./CollaborativeApp.module.css";
import Highcharts from "highcharts";

export function CollaborativeApp() {
  return (
    <div className={styles.wrapper}>
      <Chart id="chart-1" options={chart1} showThreadList={true} />
      <div className={styles.grid}>
        <Chart id="chart-2" options={chart2} showThreadList={false} />
        <Chart id="chart-3" options={chart3} showThreadList={false} />
      </div>
    </div>
  );
}

const chart1: Highcharts.Options = {
  chart: {
    type: "column",
  },
  title: {
    text: "Corn vs wheat estimated production for 2023",
    align: "left",
  },
  subtitle: {
    text:
      'Source: <a target="_blank" ' +
      'href="https://www.indexmundi.com/agriculture/?commodity=corn">indexmundi</a>',
    align: "left",
  },
  xAxis: {
    categories: ["USA", "China", "Brazil", "EU", "Argentina", "India"],
    crosshair: true,
    accessibility: {
      description: "Countries",
    },
  },
  yAxis: {
    min: 0,
    title: {
      text: "1000 metric tons (MT)",
    },
  },
  tooltip: {
    valueSuffix: " (1000 MT)",
  },
  plotOptions: {
    column: {
      pointPadding: 0.2,
      borderWidth: 0,
    },
  },
  series: [
    {
      type: "column",
      name: "Corn",
      data: [387749, 280000, 129000, 64300, 54000, 34300],
    },
    {
      type: "column",
      name: "Wheat",
      data: [45321, 140000, 10000, 140500, 19500, 113500],
    },
  ],
};

const chart2: Highcharts.Options = {
  title: {
    text: "My chart",
  },
  series: [
    {
      type: "scatter",
      data: [1, 15, 2, 13, 4, 1, 5, 14, 8],
    },
  ],
};

const chart3: Highcharts.Options = {
  title: {
    text: "My other chart",
  },
  series: [
    {
      type: "pie",
      data: [5, 2, 3],
    },
  ],
};
