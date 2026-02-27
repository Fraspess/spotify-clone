import {createApi, fetchBaseQuery} from '@reduxjs/toolkit/query/react';
import {APP_ENV} from '../../env';
import {logout, setCredentials} from './authSlice';

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

interface RegisterConfirmResponse {
    success: boolean;
}

interface Song {
  id: number | string;
  title: string;
  artist: string;
  image: string;
  durationInSeconds: number;
  songFileName: string;
}


interface UserResponse {
    email: string;
    id: number;
    username: string;
    favoriteSongs?: Song[];
}


const baseQuery = fetchBaseQuery({
    baseUrl: APP_ENV.BACKEND_URL + '/api',
    prepareHeaders: (headers) => {
        const token = localStorage.getItem('accessToken');
        if (token) {
            headers.set('authorization', `Bearer ${token}`);
        }
        return headers;
    },
});


const baseQueryWithReauth = async (args: any, api: any, extraOptions: any) => {
    let result = await baseQuery(args, api, extraOptions);

    if (result.error && result.error.status === 401) {
        try {
            const refreshResult: any = await baseQuery(
                {
                    url: 'users/refresh',
                    method: 'POST',
                    body: {token: localStorage.getItem("refreshToken")},
                },
                api,
                extraOptions
            );
            console.log(refreshResult);
            if (refreshResult.data) {
                console.log(refreshResult.data);
                await api.dispatch(setCredentials({
                    accessToken: refreshResult.data.data.accessToken,
                    refreshToken: refreshResult.data.data.refreshToken,
                }));

                result = await baseQuery(args, api, extraOptions);
            } else {
                api.dispatch(logout());
            }
        } catch {
            api.dispatch(logout());
        }
    }

    return result;
};

export const api = createApi({
        reducerPath: 'api',
        tagTypes: ['User', 'Songs'],
        baseQuery: baseQueryWithReauth,
        endpoints: (builder) => ({
            login: builder.mutation<AuthResponse, { login: string; password: string }>({
                query: (credentials) => ({
                    url: 'users/login',
                    method: 'POST',
                    body: credentials,
                }),
                async onQueryStarted(_arg, {dispatch, queryFulfilled}) {
                    try {
                        const {data: response} = await queryFulfilled;
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
            getMe: builder.query<UserResponse, void>({
                query: () => ({
                    url: "users/me",
                    method: 'GET'
                }),
                transformResponse: (response: { data: UserResponse }) => response.data,
                providesTags: ['User'],
            }),
            registerRequest:
                builder.mutation<RegisterConfirmResponse, { username: string; email: string; password: string }>({
                    query: (credentials) => ({
                        url: 'users/register-request',
                        method: 'POST',
                        body: credentials,
                    }),
                }),

            register:
                builder.mutation<AuthResponse, { confirmCode: number }>({
                    query: (confirmCode) => ({
                        url: 'users/register',
                        method: 'POST',
                        body: confirmCode,
                    }),
                    async onQueryStarted(_arg, {dispatch, queryFulfilled}) {
                        try {
                            const {data: response} = await queryFulfilled;
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

            getSongs:
                builder.query<any[], { page: number; size: number }>({
                    query: ({page = 0, size = 10}) => ({
                        url: 'songs/getAll',
                        params: {page, size},
                    }),
                    transformResponse: (response: any) => response.data?.content || [],
                    providesTags: ['Songs'],
                }),

            getAlbums:
                builder.query<any[], { page: number; size: number }>({
                    query: ({page = 0, size = 10}) => ({
                        url: 'albums/getAll',
                        params: {page, size},
                    }),
                    transformResponse: (response: any) => response.data?.content || [],
                }),

            getUserByUsername:
                builder.query<any, string>({
                    query: (username) => `users/getByUsername?username=${username}`,
                    transformResponse: (response: { data: any }) => response.data,
                }),

            getRandomSong:
                builder.query<any, any>({
                    query: () => `songs/random`,
                    transformResponse:(response: {data:any}) => response.data,
                }),
            favoriteSong: builder.mutation<any, number>({
                query: (id) => ({
                    url: 'songs/favorite-song',
                    method: 'POST',
                    body: { id },
                }),
                invalidatesTags: ['User'],
            }),
            getAlbumById: builder.query<any, number | string>({
                query: (id) => ({
                    url: 'albums/getById',
                    method: 'GET',
                    params: { id },
                }),
                transformResponse: (response: { data: any }) => response.data,
                }),
            forgotPassword: builder.mutation({
                query: (dto) => ({
                    url: '/users/forgot-password',
                    method: 'POST',
                    body: {
                        email: dto.email
                    },
                }),
                }),
            resetPassword: builder.mutation({
                query: (dto) => ({
                    url: `/users/reset-password`,
                    method: 'POST',
                    body: {
                        token: dto.token,
                        newPassword: dto.newPassword,
                    },
                }),
            }),
            disableUser: builder.mutation<void, void>({
                query: () => ({
                    url: 'users/disable',
                    method: 'DELETE',
                }),
            }),
            searchSongs: builder.query<any, string>({
                query: (search) => ({
                    url: 'songs/search',
                    method: 'GET',
                    params: { q: search },
                }),
                transformResponse: (response: { data: any }) => response.data,
            }),
        }),
    })
;

export const {
    useLoginMutation,
    useRegisterMutation,
    useGetSongsQuery,
    useGetAlbumsQuery,
    useGetUserByUsernameQuery,
    useRegisterRequestMutation,
    useGetMeQuery,
    useFavoriteSongMutation,
    useGetAlbumByIdQuery,
    useSearchSongsQuery,
    useForgotPasswordMutation,
    useResetPasswordMutation,
    useDisableUserMutation
} = api;