// src/store/dataThunks.js
import { createAsyncThunk } from '@reduxjs/toolkit';
import { fetchData } from '../services/api';
import { fetchDataStart, fetchDataSuccess, fetchDataFailure } from './dataSlice';

const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

let lastFetchTime = 0;
let cachedData = null;

export const fetchDataThunk = createAsyncThunk(
  '/users',
  async (_, { dispatch, getState }) => {
    const now = Date.now();
    const state = getState();

    // Check if cached data is available and still valid
    if (cachedData && now - lastFetchTime < CACHE_DURATION) {
      return cachedData;
    }

    try {
      dispatch(fetchDataStart());
      const response = await fetchData();
      cachedData = response.data;
      lastFetchTime = now;
      dispatch(fetchDataSuccess(response.data));
      return response.data;
    } catch (error) {
      dispatch(fetchDataFailure(error.message));
      throw error;
    }
  }
);