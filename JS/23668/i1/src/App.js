import React, { useState, useEffect } from 'react';
import JoyLogger from './components/JoyLogger';
import MoodTracker from './components/MoodTracker';
import ProgressVisualization from './components/ProgressVisualization';
import InspirationQuote from './components/InspirationQuote';

function App() {
  const [joyLogs, setJoyLogs] = useState([]);
  const [moodData, setMoodData] = useState([]);

  useEffect(() => {
    // Load saved data from localStorage or API
    const savedJoyLogs = JSON.parse(localStorage.getItem('joyLogs')) || [];
    const savedMoodData = JSON.parse(localStorage.getItem('moodData')) || [];
    setJoyLogs(savedJoyLogs);
    setMoodData(savedMoodData);
  }, []);

  useEffect(() => {
    // Save data to localStorage whenever joyLogs or moodData changes
    localStorage.setItem('joyLogs', JSON.stringify(joyLogs));
    localStorage.setItem('moodData', JSON.stringify(moodData));
  }, [joyLogs, moodData]);

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
