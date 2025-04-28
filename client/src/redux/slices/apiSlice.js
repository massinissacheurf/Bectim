import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const API_URL = "http://localhost:8800/api";

const baseQuery = fetchBaseQuery({ 
  baseUrl: API_URL,
  credentials: 'include', // Inclut automatiquement les cookies dans les requêtes
});

export const apiSlice = createApi({
  baseQuery,
  tagTypes: [],
  endpoints: (builder) => ({}),
});
