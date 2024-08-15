// src/hooks/useFavorites.js
import { useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { addFavorite, removeFavorite } from '../store/favoritesSlice';

export const useFavorites = () => {
  const dispatch = useDispatch();
  const favorites = useSelector(state => state.favorites.items);

  const addToFavorites = useCallback((item) => {
    dispatch(addFavorite(item));
  }, [dispatch]);

  const removeFromFavorites = useCallback((itemId) => {
    dispatch(removeFavorite(itemId));
  }, [dispatch]);

  const isFavorite = useCallback((itemId) => {
    return favorites.some(item => item.id === itemId);
  }, [favorites]);

  return { favorites, addToFavorites, removeFromFavorites, isFavorite };
};