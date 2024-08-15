// src/store/index.js
import { configureStore } from '@reduxjs/toolkit';
import rootReducer from './rootReducer';
import apiSlice from '../services/apiSlice';
import { localStorageMiddleware } from './localStorageMiddleware';

const store = configureStore({
  reducer: {
    ...rootReducer,
    [apiSlice.reducerPath]: apiSlice.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware()
      .concat(apiSlice.middleware)
      .concat(localStorageMiddleware),
});

// Load favorites from local storage on app start
const savedFavorites = JSON.parse(localStorage.getItem('favorites')) || [];
store.dispatch({ type: 'favorites/setFavorites', payload: savedFavorites });

export default store;