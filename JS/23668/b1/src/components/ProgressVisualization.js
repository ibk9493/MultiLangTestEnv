// components/ProgressVisualization.js
import React, { useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';

function ProgressVisualization({ joyLogs, moodData }) {
  const chartRef = useRef(null);

  useEffect(() => {
    if (chartRef.current) {
      const ctx = chartRef.current.getContext('2d');
      new Chart(ctx, {
        type: 'line',
        data: {
          labels: moodData.map(entry => new Date(entry.date).toLocaleDateString()),
          datasets: [{
            label: 'Mood',
            data: moodData.map(entry => moods.indexOf(entry.mood)),
            borderColor: 'rgb(75, 192, 192)',
            tension: 0.1
          }]
        },
        options: {
          responsive: true,
          scales: {
            y: {
              beginAtZero: true,
              max: 4
            }
          }
        }
      });
    }
  }, [moodData]);

  return (
    <div>
      <h2>Your Mood Progress</h2>
      <canvas ref={chartRef}></canvas>
    </div>
  );
}

export default ProgressVisualization;