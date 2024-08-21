// components/CalendarView.js
import React from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { Card } from 'react-bootstrap';

function CalendarView({ moodData, joyLogs }) {
  const tileContent = ({ date, view }) => {
    if(view === 'month') {
      // Check if there's a mood entry for this date
      const moodEntry = moodData.find(mood => 
        new Date(mood.date).toDateString() === date.toDateString()
      );
      return moodEntry ? <div>{moodEntry.mood}</div> : null;
    }
  };

  return (
    <Card>
      <Card.Body>
        <Card.Title>Calendar</Card.Title>
        <Calendar 
          tileContent={tileContent}
          className="mx-auto"
        />
      </Card.Body>
    </Card>
  );
}

export default CalendarView;