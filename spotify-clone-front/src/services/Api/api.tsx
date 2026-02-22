import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type { RootState } from './store';
import { APP_ENV } from '../../env';

interface AuthResponse {
  accessToken: string;
  refreshToken?: string;
  user?: {
    email: string;
    username: string;
  };
}

export const api = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({
    baseUrl: APP_ENV.BACKEND_URL + '/api',
    prepareHeaders: (headers, { getState }) => {
      const token = (getState() as RootState).auth.token;
      
      if (token && token !== 'null' && token !== 'undefined' && token !== '') {
        headers.set('authorization', `Bearer ${token}`);
      }
      return headers;
    },
  }),
  endpoints: (builder) => ({
    login: builder.mutation<AuthResponse, { login: string; password: string }>({
      query: (credentials) => ({
        url: 'users/login',
        method: 'POST',
        body: credentials,
      }),
    }),
    register: builder.mutation<AuthResponse, { username: string; email: string; password: string }>({
      query: (userData) => ({
        url: 'users/register',
        method: 'POST',
        body: userData,
      }),
    }),

  getSongs: builder.query<any[], { page: number; size: number }>({
      query: ({ page = 0, size = 10 }) => ({
        url: 'songs/getAll',
        params: { page, size },
      }),
      transformResponse: (response: any) => response.data?.content || [],
    }),

    getAlbums: builder.query<any[], { page: number; size: number }>({
      query: ({ page = 0, size = 10 }) => ({
        url: 'albums/getAll',
        params: { page, size },
      }),
      transformResponse: (response: any) => response.data?.content || [],
    }),
  }),
});

export const { useLoginMutation, useRegisterMutation, useGetSongsQuery, useGetAlbumsQuery } = api;