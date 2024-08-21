// components/InspirationQuote.js
import React, { useState, useEffect } from 'react';

function InspirationQuote() {
  const [quote, setQuote] = useState('');

  useEffect(() => {
    fetchQuote();
  }, []);

  const fetchQuote = async () => {
    try {
      const response = await fetch('https://api.quotable.io/random');
      const data = await response.json();
      setQuote(data.content);
    } catch (error) {
      console.error('Error fetching quote:', error);
    }
  };

  return (
    <div>
      <h2>Daily Inspiration</h2>
      <p>{quote}</p>
      <button onClick={fetchQuote}>New Quote</button>
    </div>
  );
}

export default InspirationQuote;