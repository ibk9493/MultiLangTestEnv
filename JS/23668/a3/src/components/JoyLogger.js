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
    <div className="mb-3">
      <h2 className="mb-3">Log Your Joy</h2>
      <form onSubmit={handleSubmit} className="form-inline">
        <div className="form-group mb-2">
          <input type="text" className="form-control" value={joyMoment} onChange={(e) => setJoyMoment(e.target.value)} placeholder="What made you happy today?" />
        </div>
        <button type="submit" className="btn btn-primary mb-2 ml-2">Log Joy</button>
      </form>
      <ul className="list-group">
        {joyLogs?.map((log) => (
          <li key={log.id} className="list-group-item">{log.moment}</li>
        ))}
      </ul>
    </div>
  );
}

export default JoyLogger;
