// components/ProgressVisualization.js
import React, { useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';

function ProgressVisualization({ joyLogs, moodData, goals, events }) {
  const chartRef = useRef(null);
  const myChartRef = useRef(null);

  const moods = ['😢', '😐', '😊', '😃', '🥳'];

  useEffect(() => {
    if (myChartRef.current) {
      myChartRef.current.destroy();
    }

    const ctx = chartRef.current.getContext('2d');
    myChartRef.current = new Chart(ctx, {
      type: 'line',
      data: {
        labels: moodData.map(entry => new Date(entry.date).toLocaleDateString()),
        datasets: [
          {
            label: 'Mood',
            data: moodData.map(entry => moods.indexOf(entry.mood)),
            borderColor: 'rgb(75, 192, 192)',
            tension: 0.1
          },
          {
            label: 'Joy Logs',
            data: moodData.map(entry => {
              const date = new Date(entry.date).toLocaleDateString();
              return joyLogs.filter(log => new Date(log.date).toLocaleDateString() === date).length;
            }),
            borderColor: 'rgb(255, 99, 132)',
            tension: 0.1
          }
        ]
      },
      options: {
        responsive: true,
        scales: {
          y: {
            beginAtZero: true,
            max: Math.max(4, Math.max(...joyLogs.map(log => log.length))),
            ticks: {
              callback: function(value, index, values) {
                return index <= 4 ? moods[index] : value;
              }
            }
          }
        },
        plugins: {
          annotation: {
            annotations: events.map(event => ({
              type: 'line',
              mode: 'vertical',
              scaleID: 'x',
              value: new Date(event.date).toLocaleDateString(),
              borderColor: 'rgb(255, 0, 0)',
              borderWidth: 2,
              label: {
                content: event.description,
                enabled: true,
                position: 'top'
              }
            }))
          }
        }
      }
    });

    return () => {
      if (myChartRef.current) {
        myChartRef.current.destroy();
      }
    };
  }, [moodData, joyLogs, events]);

  return (
    <div>
      <h2>Your Progress</h2>
      <canvas ref={chartRef}></canvas>
      <div>
        <h3>Goals Progress</h3>
        <p>{goals.filter(goal => goal.completed).length} out of {goals.length} goals completed</p>
      </div>
    </div>
  );
}

export default ProgressVisualization;