// src/components/FavoritesList.js
import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { removeFavorite } from '../store/favoritesSlice';

const FavoritesList = () => {
  const dispatch = useDispatch();
  const favorites = useSelector(state => state.reducer.favorites.items);

  return (
    <div>
      <h2>Favorites</h2>
      <ul>
        {favorites.length > 0 ? (
          favorites.map(item => (
            <li key={item.id}>
              <img src={item.thumbnail} alt={item.title} />
              <h3>{item.title}</h3>
              <button onClick={() => dispatch(removeFavorite(item.id))}>
                {'❤️'}
              </button>
            </li>
          ))
        ) : (
          <p>No favorites added yet.</p>
        )}
      </ul>
    </div>
  );
};

export default FavoritesList;
