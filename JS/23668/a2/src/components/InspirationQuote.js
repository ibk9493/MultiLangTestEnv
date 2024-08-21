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
      setQuote('Keep your face always toward the sunshine—and shadows will fall behind you. - Walt Whitman');
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
