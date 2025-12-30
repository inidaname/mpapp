import {
  BaseQueryFn,
  createApi,
  FetchArgs,
  fetchBaseQuery,
  FetchBaseQueryError,
} from '@reduxjs/toolkit/query/react';
import * as Keychain from 'react-native-keychain';
import { SERVICE_NAME } from '../config/TOKEN';

const rawBaseQuery = fetchBaseQuery({
  baseUrl: 'https://api.insfers.com/',
  mode: 'cors',
  prepareHeaders: async headers => {
    try {
      const creds = await Keychain.getGenericPassword({
        service: SERVICE_NAME,
      });

      if (creds) {
        headers.set('authorization', `Bearer ${creds.password}`);
      }
    } catch (err) {
      console.warn('No token found', err);
    }

    return headers;
  },
});

export const baseQuery: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {
  try {
    return await rawBaseQuery(args, api, extraOptions);
  } catch (error: any) {
    if (error?.name === 'AbortError') {
      return {
        error: {
          status: 'CUSTOM_ERROR',
          error: 'Request aborted',
        },
      };
    }

    return {
      error: {
        status: 'CUSTOM_ERROR',
        error: error?.message ?? 'Unknown error',
      },
    };
  }
};

export const apiSlice = createApi({
  reducerPath: 'api',
  baseQuery,
  endpoints: () => ({}),
  refetchOnReconnect: true,
  tagTypes: [
    'icons',
    'balance',
    'external-accounts',
    'wallet',
    'user',
    'contacts',
    'transactions',
    'notifications',
  ],
});
