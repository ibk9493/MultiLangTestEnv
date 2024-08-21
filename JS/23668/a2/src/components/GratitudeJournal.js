// components/GratitudeJournal.js
import React, { useState } from 'react';

function GratitudeJournal({ entries, setEntries }) {
  const [newEntry, setNewEntry] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (newEntry.trim()) {
      const entry = {
        id: Date.now(),
        text: newEntry,
        date: new Date().toISOString(),
      };
      setEntries([...entries, entry]);
      setNewEntry('');
    }
  };

  return (
    <div>
      <h2>Gratitude Journal</h2>
      <form onSubmit={handleSubmit}>
        <textarea
          value={newEntry}
          onChange={(e) => setNewEntry(e.target.value)}
          placeholder="What are you grateful for today?"
        />
        <button type="submit">Save Entry</button>
      </form>
      <ul>
        {entries.map((entry) => (
          <li key={entry.id}>
            <strong>{new Date(entry.date).toLocaleDateString()}</strong>: {entry.text}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default GratitudeJournal;