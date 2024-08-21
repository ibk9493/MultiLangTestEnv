import React from 'react';
import { Line } from 'react-chartjs-2';

function MoodChart({ logs }) {
  const data = {
    labels: logs.map(log => log.date.toLocaleDateString()),
    datasets: [{
      label: 'Joy Level',
      data: logs.map(log => log.joyLevel), // Assuming you rate your joy level
      borderColor: 'rgb(75, 192, 192)',
      tension: 0.1
    }]
  };

  return <Line data={data} />;
}

export default MoodChart;