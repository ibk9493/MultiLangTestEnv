// src/components/DataComponent.js
import React, { useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { addFavorite, removeFavorite } from '../store/favoritesSlice';
import { useFetchDataQuery } from '../services/apiSlice';

const DataComponent = React.memo(() => {
  const dispatch = useDispatch();
  const favorites = useSelector(state => state.reducer.favorites.items);
  const { data, error, isLoading } = useFetchDataQuery();

  const handleToggleFavorite = useCallback((item) => {
    const isFavorite = favorites.some(fav => fav.id === item.id);
    if (isFavorite) {
      dispatch(removeFavorite(item.id));
    } else {
      dispatch(addFavorite(item));
    }
  }, [dispatch, favorites]);

  if (error) return 'error';
  return (
    <div>
      <h2>Data Items</h2>
      <ul>
        {!isLoading && data?.map(item => (
          <li key={item.id}>
            <img src={item.thumbnail} alt={item.title} />
            <h3>{item.title}</h3>
            <p>{item.content.slice(0, 100)}...</p> {/* Show a preview of the content */}
            <button onClick={() => handleToggleFavorite(item)}>
              {favorites.some(fav => fav.id === item.id) ? '❤️' : '🤍'}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
});

export default DataComponent;
