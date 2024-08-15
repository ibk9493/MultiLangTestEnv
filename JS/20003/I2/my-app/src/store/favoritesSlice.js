// src/store/favoritesSlice.js
import { createSlice } from '@reduxjs/toolkit';

// Utility function to save favorites to localStorage
const saveFavoritesToLocalStorage = (favorites) => {
  try {
    localStorage.setItem('favorites', JSON.stringify(favorites));
  } catch (error) {
    console.error("Failed to save favorites to localStorage:", error);
  }
};

const favoritesSlice = createSlice({
  name: 'favorites',
  initialState: {
    items: [],
    error: null,
  },
  reducers: {
    addFavorite: (state, action) => {
      const exists = state.items.some(item => item.id === action.payload.id);
      if (!exists) {
        state.items = [...state.items, action.payload]; // Ensure immutability
        saveFavoritesToLocalStorage(state.items); // Use the utility function
      }
    },
    removeFavorite: (state, action) => {
      state.items = state.items.filter(item => item.id !== action.payload);
      saveFavoritesToLocalStorage(state.items); // Use the utility function
    },
  },
});

export const { addFavorite, removeFavorite } = favoritesSlice.actions;
export default favoritesSlice.reducer;
