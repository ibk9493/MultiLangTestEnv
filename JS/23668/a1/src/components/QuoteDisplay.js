import React, { useState, useEffect } from 'react';

function QuoteDisplay() {
  const [quote, setQuote] = useState('');

  useEffect(() => {
    fetch('https://type.fit/api/quotes')
      .then(response => response.json())
      .then(data => setQuote(`${data.content} — ${data.author}`));
  }, []);

  return <div>{quote}</div>;
}

export default QuoteDisplay;