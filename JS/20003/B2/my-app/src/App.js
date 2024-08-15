// src/App.js
import React from 'react';
import DataComponent from './components/DataComponent';
import FavoritesList from './components/FavoritesList';

const App = () => {
  return (
    <div>
      <h1>My App</h1>
      <DataComponent />
      <FavoritesList />
    </div>
  );
};

export default App;