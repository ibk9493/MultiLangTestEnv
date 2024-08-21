import React from 'react';

const moods = ['😢', '😐', '😊', '😃', '🥳'];

function MoodTracker({ moodData, setMoodData }) {
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
      <div className="btn-group" role="group">
        {['😢', '😐', '😊', '😃', '🥳'].map((mood, index) => (
          <button key={index} onClick={() => handleMoodSelect(mood)} className="btn btn-outline-secondary">
            {mood}
          </button>
        ))}
      </div>
    </div>
  );
}

export default MoodTracker;
