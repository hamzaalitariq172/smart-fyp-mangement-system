import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, PointElement, LineElement } from 'chart.js';
import { Doughnut, Bar, Line } from 'react-chartjs-2';

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, PointElement, LineElement);

export const DoughnutChart = ({ data, labels, colors = ['#6366f1', '#22c55e', '#f97316', '#ef4444', '#a855f7'] }) => {
  const chartData = {
    labels,
    datasets: [{
      data,
      backgroundColor: colors,
      borderWidth: 0,
    }],
  };

  const options = {
    cutout: '70%',
    plugins: {
      legend: { position: 'bottom', labels: { padding: 16, usePointStyle: true, color: '#6b7280' } },
    },
    maintainAspectRatio: false,
  };

  return (
    <div className="card h-72">
      <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">Project Status</h3>
      <Doughnut data={chartData} options={options} />
    </div>
  );
};

export const BarChart = ({ data, labels, label = 'Value' }) => {
  const chartData = {
    labels,
    datasets: [{
      label,
      data,
      backgroundColor: '#6366f1',
      borderRadius: 8,
    }],
  };

  const options = {
    plugins: { legend: { display: false } },
    scales: {
      y: { beginAtZero: true, grid: { color: 'rgba(107, 114, 128, 0.1)' }, ticks: { color: '#6b7280' } },
      x: { grid: { display: false }, ticks: { color: '#6b7280' } },
    },
    maintainAspectRatio: false,
  };

  return (
    <div className="card h-72">
      <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">{label}</h3>
      <Bar data={chartData} options={options} />
    </div>
  );
};

export const LineChart = ({ data, labels, label = 'Trend' }) => {
  const chartData = {
    labels,
    datasets: [{
      label,
      data,
      borderColor: '#6366f1',
      backgroundColor: 'rgba(99, 102, 241, 0.1)',
      fill: true,
      tension: 0.4,
      pointRadius: 4,
    }],
  };

  const options = {
    plugins: { legend: { display: false } },
    scales: {
      y: { beginAtZero: true, grid: { color: 'rgba(107, 114, 128, 0.1)' }, ticks: { color: '#6b7280' } },
      x: { grid: { display: false }, ticks: { color: '#6b7280' } },
    },
    maintainAspectRatio: false,
  };

  return (
    <div className="card h-72">
      <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">{label}</h3>
      <Line data={chartData} options={options} />
    </div>
  );
};
