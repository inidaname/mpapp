import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { getToken } from '../helpers/token-helper';

const baseQuery = fetchBaseQuery({
  baseUrl: "https://devapi.insfers.com/",
  mode: "cors",
  prepareHeaders: (headers) => {
    // headers.set('Accept', 'application/json');
    const token = getToken();

    if (token) {
      headers.set('authorization', `Bearer ${token}`);
    }
    // headers.set('Content-Type', 'application/json');

    return headers;
  },
})

export const apiSlice = createApi({
  reducerPath: "api",
  baseQuery,
  endpoints: () => ({}),
  tagTypes: [ "icons" ]
})