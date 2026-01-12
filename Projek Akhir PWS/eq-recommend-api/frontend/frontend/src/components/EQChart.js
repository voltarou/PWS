import React from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
} from "chart.js";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

// Keterangan frekuensi
const freqLabels = {
  "60Hz": "Bass",
  "170Hz": "Bass",
  "310Hz": "Low-Mid",
  "600Hz": "Mid",
  "1kHz": "Mid",
  "3kHz": "High-Mid",
  "6kHz": "Treble",
  "12kHz": "Treble",
  "14kHz": "Treble",
  "16kHz": "Treble",
};

// Urutan frekuensi agar konsisten
const frequencyOrder = [
  "60Hz",
  "170Hz",
  "310Hz",
  "600Hz",
  "1kHz",
  "3kHz",
  "6kHz",
  "12kHz",
  "14kHz",
  "16kHz",
];

const EQChart = ({ eqValues }) => {
  if (!eqValues) return null;

  // label sumbu X: tambahkan keterangan
  const labels = frequencyOrder.map(f => `${f} (${freqLabels[f] || ""})`);
  const dataValues = frequencyOrder.map(f => eqValues[f] ?? 0);

  const data = {
    labels,
    datasets: [
      {
        label: 'EQ Band (dB)',
        data: dataValues,
        backgroundColor: 'rgba(75, 192, 192, 0.6)',
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: { position: 'top' },
      title: { display: true, text: 'EQ Profile Chart' },
      tooltip: {
        callbacks: {
          label: function(context) {
            const val = context.raw;
            const freq = frequencyOrder[context.dataIndex];
            const desc = freqLabels[freq] ? ` (${freqLabels[freq]})` : '';
            return `${val} dB${desc}`;
          }
        }
      }
    },
    scales: {
      y: { beginAtZero: true },
      x: {
        ticks: { autoSkip: false } // tampil semua label frekuensi
      }
    },
  };

  return <Bar data={data} options={options} />;
};

export default EQChart;
