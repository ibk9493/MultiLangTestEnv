import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { addFavorite, removeFavorite } from '../store/favoritesSlice';
import { selectFavorites } from '../store/selectors';

const FavoritesComponent = () => {
  const dispatch = useDispatch();
  const favorites = useSelector(selectFavorites);

  const handleAddToFavorites = (item) => {
    dispatch(addFavorite(item));
  };

  const handleRemoveFromFavorites = (itemId) => {
    dispatch(removeFavorite({ id: itemId }));
  };

  return (
    <div>
      <h2>Favorites</h2>
      <ul>
        {favorites?.map(item => (
          <li key={item.id}>
            {item.name} 
            <button onClick={() => handleRemoveFromFavorites(item.id)}>Remove</button>
          </li>
        ))}
      </ul>
      {/* Example of adding an item to favorites */}
      <button onClick={() => handleAddToFavorites({ id: '123', name: 'Sample Item' })}>
        Add to Favorites
      </button>
    </div>
  );
};

export default FavoritesComponent;