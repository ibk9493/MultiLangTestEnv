import React, { useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';
import { Card, CardBody } from 'react-bootstrap';

function ProgressVisualization({ joyLogs, moodData }) {
  const chartRef = useRef(null);
  const myChartRef = useRef(null); // Ref to store the chart instance

  // Define the moods array within the component
  const moods = ['😢', '😐', '😊', '😃', '🥳'];

  useEffect(() => {
    if (myChartRef.current) {
      myChartRef.current.destroy(); // Destroy the existing chart instance if it exists
    }

    const ctx = chartRef.current.getContext('2d');
    myChartRef.current = new Chart(ctx, {
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
            max: 4,
            ticks: {
              callback: function(value) {
                return moods[value];
              }
            }
          }
        }
      }
    });

    // Cleanup function to destroy the chart when the component unmounts or dependencies change
    return () => {
      if (myChartRef.current) {
        myChartRef.current.destroy();
      }
    };
  }, [moodData]);

  return (
    <Card>
      <Card.Body>
        <Card.Title>Your Mood Progress</Card.Title>
        <canvas ref={chartRef}></canvas>
      </Card.Body>
    </Card>
  );
}

export default ProgressVisualization;
