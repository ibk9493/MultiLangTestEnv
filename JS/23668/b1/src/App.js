import React, { useState, useEffect } from 'react';
import JoyLogger from './components/JoyLogger';
import MoodTracker from './components/MoodTracker';
import ProgressVisualization from './components/ProgressVisualization';
import InspirationQuote from './components/InspirationQuote';

function App() {
  const [joyLogs, setJoyLogs] = useState([]);
  const [moodData, setMoodData] = useState([]);

  useEffect(() => {
    // Simulate fetching data from an API with setTimeout
    const fetchData = async () => {
      try {
        // Simulate API response for joy logs
        const joyLogsResponse = await new Promise((resolve) => {
          setTimeout(() => {
            resolve([
              { id: 1, date: '2024-08-01', description: 'Went for a walk in the park' },
              { id: 2, date: '2024-08-02', description: 'Had a great conversation with a friend' },
              { id: 3, date: '2024-08-03', description: 'Completed a challenging project at work' },
            ]);
          }, 1000);
        });

        // Simulate API response for mood data
        const moodDataResponse = await new Promise((resolve) => {
          setTimeout(() => {
            resolve([
              { id: 1, date: '2024-08-01', mood: 'happy' },
              { id: 2, date: '2024-08-02', mood: 'content' },
              { id: 3, date: '2024-08-03', mood: 'excited' },
            ]);
          }, 1000);
        });

        // Set the data to state variables
        setJoyLogs(joyLogsResponse);
        setMoodData(moodDataResponse);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="App">
      <h1>Positivity Tracker</h1>
      <InspirationQuote />
      <JoyLogger joyLogs={joyLogs} setJoyLogs={setJoyLogs} />
      <MoodTracker moodData={moodData} setMoodData={setMoodData} />
      <ProgressVisualization joyLogs={joyLogs} moodData={moodData} />
    </div>
  );
}

export default App;
