import React, { useState, useEffect } from 'react';
import JoyLogger from './components/JoyLogger';
import MoodTracker from './components/MoodTracker';
import ProgressVisualization from './components/ProgressVisualization';
import InspirationQuote from './components/InspirationQuote';
import PositivityGoals from './components/PositivityGoals';
import CalendarView from './components/CalendarView';
import ReflectionNotes from './components/ReflectionNotes';
function App() {
  const [joyLogs, setJoyLogs] = useState([]);
  const [moodData, setMoodData] = useState([]);
  const [goals, setGoals] = useState([]);
  const [reflections, setReflections] = useState([]);
  function setupReminder(time, message) {
    if ('Notification' in window && Notification.permission === "granted") {
      setTimeout(() => {
        new Notification(message);
      }, time);
    } else if (Notification.permission !== 'denied') {
      Notification.requestPermission().then(permission => {
        if (permission === "granted") {
          setupReminder(time, message);
        }
      });
    }
    // For SMS, you would need to integrate with Twilio or another SMS service here
  }
  useEffect(() => {
    // Load saved data from localStorage or API
    const savedJoyLogs = JSON.parse(localStorage.getItem('joyLogs')) || [];
    const savedMoodData = JSON.parse(localStorage.getItem('moodData')) || [];
    setJoyLogs(savedJoyLogs);
    setMoodData(savedMoodData);
    setupReminder(3600000, 'Time to log a moment of joy!');
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
      <PositivityGoals goals={goals} setGoals={setGoals} />
      <CalendarView moodData={moodData} joyLogs={joyLogs} />
      <ReflectionNotes reflections={reflections} setReflections={setReflections} />
    </div>
  );
}

export default App;
