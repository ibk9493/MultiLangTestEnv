// src/services/api.js
import axios from 'axios';

const API_BASE_URL = 'https://jsonplaceholder.org';

const api = axios.create({
  baseURL: API_BASE_URL,
});

export const fetchData = () => api.get('/users');