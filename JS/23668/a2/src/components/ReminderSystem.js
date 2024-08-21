// components/ReminderSystem.js
import React, { useState, useEffect } from 'react';

function ReminderSystem() {
  const [reminderTime, setReminderTime] = useState('20:00');

  useEffect(() => {
    const checkTime = () => {
      const now = new Date();
      const [hours, minutes] = reminderTime.split(':');
      if (now.getHours() === parseInt(hours) && now.getMinutes() === parseInt(minutes)) {
        alert("Don't forget to log your joyful moments today!");
      }
    };

    const intervalId = setInterval(checkTime, 60000); // Check every minute

    return () => clearInterval(intervalId);
  }, [reminderTime]);

  return (
    <div>
      <h2>Joy Logging Reminder</h2>
      <input
        type="time"
        value={reminderTime}
        onChange={(e) => setReminderTime(e.target.value)}
      />
      <p>Current reminder set for: {reminderTime}</p>
    </div>
  );
}

export default ReminderSystem;