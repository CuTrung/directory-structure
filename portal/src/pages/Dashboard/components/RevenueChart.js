import React from 'react';

import { Chart } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
  registerables as registerablesJS,
} from 'chart.js';
ChartJS.register(...registerablesJS);
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler);

export const options = {
  scales: {
    y: {
      beginAtZero: true,
    },
  },
  plugins: {
    legend: false,
  },
};

const RevenueChart = ({ data }) => {
  const dataChart = {
    labels: (data ?? [])?.map((o) => o?.date),
    datasets: [
      {
        type: 'line',
        label: 'Doanh thu',
        data: (data ?? [])?.map((o) => o?.total_money ?? 0),
        borderColor: 'rgb(255, 99, 132)',
        backgroundColor: 'rgba(255, 99, 132, 0.5)',
        borderWidth: 2,
        tension: 0.5,
      },
    ],
  };
  return <Chart options={options} data={dataChart} />;
};

export default RevenueChart;
