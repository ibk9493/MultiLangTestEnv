// components/MoodTracker.js
import React from 'react';

function MoodTracker({ moodData, setMoodData }) {
  const moods = ['😢', '😐', '😊', '😃', '🥳'];

  const handleMoodSelect = (mood) => {
    const newMoodEntry = {
      mood: mood,
      date: new Date().toISOString(),
    };
    setMoodData([...moodData, newMoodEntry]);
  };

  return (
    <div>
      <h2>How are you feeling today?</h2>
      <div>
        {moods.map((mood, index) => (
          <button key={index} onClick={() => handleMoodSelect(mood)}>
            {mood}
          </button>
        ))}
      </div>
    </div>
  );
}

export default MoodTracker;