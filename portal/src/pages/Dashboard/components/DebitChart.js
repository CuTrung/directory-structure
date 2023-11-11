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
  responsive: true,
  plugins: {
    legend: {
      position: 'top',
    },
    title: {
      display: false,
    },
  },
};

const DebitChart = ({ data }) => {
  const dataChart = {
    labels: ['CN thu', 'CN chi'],
    datasets: [
      {
        label: 'Công nợ',
        data: [data?.total_debit_receive || 0, data?.total_debit_payment || 0],
        backgroundColor: ['rgba(255, 99, 132, 0.5)', 'rgb(54, 162, 235, 0.5)'],
      },
    ],
  };
  return (
    <Chart
      type='doughnut'
      options={options}
      data={dataChart}
    />
  );
};

export default DebitChart;
