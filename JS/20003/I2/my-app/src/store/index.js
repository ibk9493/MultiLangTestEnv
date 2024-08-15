// src/store/index.js
import { configureStore } from '@reduxjs/toolkit';
import rootReducer from './rootReducer';
import apiSlice from '../services/apiSlice';
import { localStorageMiddleware } from './localStorageMiddleware';

const store = configureStore({
  reducer: {
    reducer: rootReducer,
    [apiSlice.reducerPath]: apiSlice.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(apiSlice.middleware).concat(localStorageMiddleware),
});

export default store;
