import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type { RootState } from './store';
import { APP_ENV } from '../../env';
import { setCredentials } from './authSlice';

interface AuthResponse {
  success: boolean;
  message: string;
  data: {
    accessToken: string;
    refreshToken: string;
    user?: {
      email: string;
      username: string;
    };
  };
}

export const api = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({
    baseUrl: APP_ENV.BACKEND_URL + '/api',
    prepareHeaders: (headers, { getState }) => {
      const token = (getState() as RootState).auth.accessToken;
      if (token) {
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
      async onQueryStarted(_arg, { dispatch, queryFulfilled }) {
        try {
          const { data: response } = await queryFulfilled;
          if (response.success && response.data) {
            dispatch(setCredentials({
              accessToken: response.data.accessToken,
              refreshToken: response.data.refreshToken,
              user: response.data.user || null
            }));
          }
        } catch (err) {
          console.error('Auth failed:', err);
        }
      },
    }),

    register: builder.mutation<AuthResponse, { username: string; email: string; password: string }>({
      query: (userData) => ({
        url: 'users/register',
        method: 'POST',
        body: userData,
      }),
      async onQueryStarted(_arg, { dispatch, queryFulfilled }) {
        try {
          const { data: response } = await queryFulfilled;
          if (response.success && response.data) {
            dispatch(setCredentials({
              accessToken: response.data.accessToken,
              refreshToken: response.data.refreshToken,
              user: response.data.user || null
            }));
          }
        } catch (err) {
          console.error('Auth failed:', err);
        }
      },
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

    getUserByUsername: builder.query<any, string>({
      query: (username) => `users/getByUsername?username=${username}`,
    transformResponse: (response: { data: any }) => response.data,
    }),
  }),
});

export const { useLoginMutation, useRegisterMutation, useGetSongsQuery, useGetAlbumsQuery, useGetUserByUsernameQuery } = api;