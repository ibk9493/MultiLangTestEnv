// components/CalendarView.js
import React from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';

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
    <div>
      <h2>Calendar</h2>
      <Calendar 
        tileContent={tileContent}
      />
    </div>
  );
}

export default CalendarView;