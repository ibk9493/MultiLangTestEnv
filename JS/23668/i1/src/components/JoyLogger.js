import React, { useState } from 'react';

function JoyLogger({ joyLogs, setJoyLogs }) {
  const [joyMoment, setJoyMoment] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (joyMoment.trim()) {
      const newLog = {
        id: Date.now(),
        moment: joyMoment,
        date: new Date().toISOString(),
      };
      setJoyLogs([...joyLogs, newLog]);
      setJoyMoment('');
    }
  };

  return (
    <div>
      <h2>Log Your Joy</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={joyMoment}
          onChange={(e) => setJoyMoment(e.target.value)}
          placeholder="What made you happy today?"
        />
        <button type="submit">Log Joy</button>
      </form>
      <ul>
        {joyLogs.map((log) => (
          <li key={log.id}>{log.moment}</li>
        ))}
      </ul>
    </div>
  );
}

export default JoyLogger;
