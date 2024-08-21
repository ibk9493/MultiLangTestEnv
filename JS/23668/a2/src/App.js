import React, { useState, useEffect } from 'react';
import JoyLogger from './components/JoyLogger';
import MoodTracker from './components/MoodTracker';
import ProgressVisualization from './components/ProgressVisualization';
import InspirationQuote from './components/InspirationQuote';
import GoalSetter from './components/GoalSetter';
import ReminderSystem from './components/ReminderSystem';
import CalendarIntegration from './components/CalendarIntegration';
import GratitudeJournal from './components/GratitudeJournal';

function App() {
  const [joyLogs, setJoyLogs] = useState([]);
  const [moodData, setMoodData] = useState([]);
  const [goals, setGoals] = useState([]);
  const [gratitudeEntries, setGratitudeEntries] = useState([]);
  const [events, setEvents] = useState([]);

  useEffect(() => {
    // Load saved data from localStorage or API
    const savedJoyLogs = JSON.parse(localStorage.getItem('joyLogs')) || [];
    const savedMoodData = JSON.parse(localStorage.getItem('moodData')) || [];
    const savedGoals = JSON.parse(localStorage.getItem('goals')) || [];
    const savedGratitudeEntries = JSON.parse(localStorage.getItem('gratitudeEntries')) || [];
    const savedEvents = JSON.parse(localStorage.getItem('events')) || [];
    setGoals(savedGoals);
    setGratitudeEntries(savedGratitudeEntries);
    setEvents(savedEvents);
    setJoyLogs(savedJoyLogs);
    setMoodData(savedMoodData);
  }, []);

  useEffect(() => {
    // Save data to localStorage whenever joyLogs or moodData changes
    localStorage.setItem('joyLogs', JSON.stringify(joyLogs));
    localStorage.setItem('moodData', JSON.stringify(moodData));
    localStorage.setItem('goals', JSON.stringify(goals));
    localStorage.setItem('gratitudeEntries', JSON.stringify(gratitudeEntries));
    localStorage.setItem('events', JSON.stringify(events));
  }, [joyLogs, moodData,goals, gratitudeEntries, events]);

  return (
    <div className="App">
      <h1>Positivity Tracker</h1>
      <InspirationQuote />
      <JoyLogger joyLogs={joyLogs} setJoyLogs={setJoyLogs} />
      <MoodTracker moodData={moodData} setMoodData={setMoodData} />
      <GoalSetter goals={goals} setGoals={setGoals} />
      <ReminderSystem />
      <CalendarIntegration events={events} setEvents={setEvents} moodData={moodData} />
      <GratitudeJournal entries={gratitudeEntries} setEntries={setGratitudeEntries} />
      <ProgressVisualization joyLogs={joyLogs} moodData={moodData} goals={goals} events={events} />
    </div>
  );
}

export default App;
