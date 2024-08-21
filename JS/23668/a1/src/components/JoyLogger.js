import React, { useState } from 'react';
function JoyLogger({ onLog }) {
  const [moment, setMoment] = useState('');
  const [date, setDate] = useState(new Date());

  const handleSubmit = (e) => {
    e.preventDefault();
    onLog({ moment, date });
    setMoment('');
  };

  return (
    <form onSubmit={handleSubmit}>
      <input value={moment} onChange={(e) => setMoment(e.target.value)} placeholder="Describe your joyful moment" />
      <input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
      <button type="submit">Log Joy</button>
    </form>
  );
}

export default JoyLogger;