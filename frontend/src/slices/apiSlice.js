import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

// Dodajemo credentials: 'include'
const baseQuery = fetchBaseQuery({ 
  baseUrl: '',
  credentials: 'include' 
});

export const apiSlice = createApi({
  baseQuery,
  tagTypes: ['Product', 'Order', 'User'],
  endpoints: (builder) => ({}),
});