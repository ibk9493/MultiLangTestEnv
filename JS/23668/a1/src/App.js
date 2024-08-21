import React, { useState } from 'react';
import JoyLogger from './components/JoyLogger';
import MoodChart from './components/MoodChart';
import QuoteDisplay from './components/QuoteDisplay';

function App() {
  const [joyLogs, setJoyLogs] = useState([]);

  return (
    <div>
      <QuoteDisplay />
      <JoyLogger onLog={(log) => setJoyLogs([...joyLogs, log])} />
      <MoodChart logs={joyLogs} />
    </div>
  );
}

export default App;