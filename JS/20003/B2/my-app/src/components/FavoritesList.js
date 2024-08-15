// src/components/FavoritesList.js
import React from 'react';
import { useFavorites } from '../hooks/useFavorites';

const FavoritesList = () => {
  const { favorites, removeFromFavorites } = useFavorites();

  return (
    <div>
      <h2>Favorites</h2>
      <ul>
        {favorites.map(item => (
          <li key={item.id}>
            {item.name}
            <button onClick={() => removeFromFavorites(item.id)}>Remove</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default FavoritesList;