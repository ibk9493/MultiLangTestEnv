// src/components/DataComponent.js
import React, { useCallback } from 'react';
import { useFetchDataQuery } from '../services/apiSlice';
import { useFavorites } from '../hooks/useFavorites';

const DataComponent = React.memo(() => {
  const { data, error, isLoading } = useFetchDataQuery();
  const { addToFavorites, removeFromFavorites, isFavorite } = useFavorites();

  const handleToggleFavorite = useCallback((item) => {
    if (isFavorite(item.id)) {
      removeFromFavorites(item.id);
    } else {
      addToFavorites(item);
    }
  }, [addToFavorites, removeFromFavorites, isFavorite]);

  const renderItem = useCallback((item) => {
    const favorite = isFavorite(item.id);
    return (
      <li key={item.id}>
        {item.name}
        <button onClick={() => handleToggleFavorite(item)}>
          {favorite ? '❤️' : '🤍'}
        </button>
      </li>
    );
  }, [handleToggleFavorite, isFavorite]);

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <ul>
      {data.map(renderItem)}
    </ul>
  );
});

export default DataComponent;