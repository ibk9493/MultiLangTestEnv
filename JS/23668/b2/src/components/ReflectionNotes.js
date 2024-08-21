// components/ReflectionNotes.js
import React, { useState } from 'react';

function ReflectionNotes({ reflections, setReflections }) {
  const [note, setNote] = useState('');

  const saveReflection = (e) => {
    e.preventDefault();
    if (note) {
      const newReflection = {
        id: Date.now(),
        text: note,
        date: new Date().toISOString()
      };
      setReflections([...reflections, newReflection]);
      setNote('');
    }
  };

  return (
    <div>
      <h2>Reflections & Gratitude</h2>
      <form onSubmit={saveReflection}>
        <textarea 
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder="Write your reflections or things you are grateful for..."
        />
        <button type="submit">Save</button>
      </form>
      <div>
        {reflections.map(reflection => (
          <div key={reflection.id}>
            <p>{reflection.text}</p>
            <small>{new Date(reflection.date).toLocaleDateString()}</small>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ReflectionNotes;