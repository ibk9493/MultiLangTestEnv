// components/CalendarIntegration.js
import React, { useState } from 'react';

function CalendarIntegration({ events, setEvents, moodData }) {
  const [newEvent, setNewEvent] = useState({ date: '', description: '' });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (newEvent.date && newEvent.description) {
      setEvents([...events, newEvent]);
      setNewEvent({ date: '', description: '' });
    }
  };

  const getMoodForDate = (date) => {
    const moodEntry = moodData.find(entry => entry.date.startsWith(date));
    return moodEntry ? moodEntry.mood : 'No mood logged';
  };

  return (
    <div>
      <h2>Life Events Calendar</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="date"
          value={newEvent.date}
          onChange={(e) => setNewEvent({...newEvent, date: e.target.value})}
        />
        <input
          type="text"
          value={newEvent.description}
          onChange={(e) => setNewEvent({...newEvent, description: e.target.value})}
          placeholder="Event description"
        />
        <button type="submit">Add Event</button>
      </form>
      <ul>
        {events.map((event, index) => (
          <li key={index}>
            {event.date}: {event.description} - Mood: {getMoodForDate(event.date)}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default CalendarIntegration;