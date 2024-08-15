// src/store/rootReducer.js
import { combineReducers } from '@reduxjs/toolkit';
import dataReducer from './dataSlice';
import favoritesReducer from './favoritesSlice';

const rootReducer = combineReducers({
  data: dataReducer,
  favorites: favoritesReducer,
});

export default rootReducer;