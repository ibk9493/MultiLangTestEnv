// src/store/favoritesSlice.js
import { createSlice } from '@reduxjs/toolkit';

const favoritesSlice = createSlice({
  name: 'favorites',
  initialState: {
    items: JSON.parse(localStorage.getItem('userFavorites')) || [], // Load from local storage
  },
  reducers: {
    addFavorite: (state, action) => {
      if (!state.items.find(item => item.id === action.payload.id)) {
        state.items.push(action.payload);
        localStorage.setItem('userFavorites', JSON.stringify(state.items)); // Save to local storage
      }
    },
    removeFavorite: (state, action) => {
      state.items = state.items.filter(item => item.id !== action.payload.id);
      localStorage.setItem('userFavorites', JSON.stringify(state.items)); // Update local storage
    },
    clearFavorites: (state) => {
      state.items = [];
      localStorage.removeItem('userFavorites'); // Clear local storage
    },
  },
});

export const { addFavorite, removeFavorite, clearFavorites } = favoritesSlice.actions;
export default favoritesSlice.reducer;