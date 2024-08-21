// components/MoodTracker.js
import React from 'react';
import { Button, ButtonGroup } from 'react-bootstrap';

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
      <h2 className="mb-3">How are you feeling today?</h2>
      <ButtonGroup>
        {moods.map((mood, index) => (
          <Button key={index} onClick={() => handleMoodSelect(mood)} variant="outline-primary">
            {mood}
          </Button>
        ))}
      </ButtonGroup>
    </div>
  );
}

export default MoodTracker;