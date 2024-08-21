import React, { useState, useEffect } from 'react';
import JoyLogger from './components/JoyLogger';
import MoodTracker from './components/MoodTracker';
import ProgressVisualization from './components/ProgressVisualization';
import InspirationQuote from './components/InspirationQuote';
import PositivityGoals from './components/PositivityGoals';
import CalendarView from './components/CalendarView';
import ReflectionNotes from './components/ReflectionNotes';
import { Container, Tab, Tabs, Row, Col } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';


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
    <Container className="mt-4">
      <h1 className="text-center mb-4">Positivity Tracker</h1>
      <InspirationQuote />
      <Tabs defaultActiveKey="daily" id="positivity-tabs" className="mb-3">
        <Tab eventKey="daily" title="Daily Log">
          <Row>
            <Col md={6}>
              <JoyLogger joyLogs={joyLogs} setJoyLogs={setJoyLogs} />
            </Col>
            <Col md={6}>
              <MoodTracker moodData={moodData} setMoodData={setMoodData} />
            </Col>
          </Row>
        </Tab>
        <Tab eventKey="progress" title="Progress">
          <ProgressVisualization joyLogs={joyLogs} moodData={moodData} />
        </Tab>
        <Tab eventKey="goals" title="Goals">
          <PositivityGoals goals={goals} setGoals={setGoals} />
        </Tab>
        <Tab eventKey="calendar" title="Calendar">
          <CalendarView moodData={moodData} joyLogs={joyLogs} />
        </Tab>
        <Tab eventKey="reflections" title="Reflections">
          <ReflectionNotes reflections={reflections} setReflections={setReflections} />
        </Tab>
      </Tabs>
    </Container>
  );
}

export default App;
