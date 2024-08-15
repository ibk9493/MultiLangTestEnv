// src/services/apiSlice.js
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const apiSlice = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({ baseUrl: 'https://jsonplaceholder.org' }),
  endpoints: (builder) => ({
    fetchData: builder.query({
      query: () => '/users',
    }),
  }),
});

export const { useFetchDataQuery } = apiSlice;
export default apiSlice;