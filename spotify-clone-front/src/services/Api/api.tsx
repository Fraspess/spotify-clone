import {createApi, fetchBaseQuery} from '@reduxjs/toolkit/query/react';
import type {RootState} from './store';
import {APP_ENV} from '../../env';
import {logout, setCredentials} from './authSlice';
import {useDispatch} from "react-redux";

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

interface UserResponse {
    email: string;
    id: number;
    username: string;

}


const baseQuery = fetchBaseQuery({
    baseUrl: APP_ENV.BACKEND_URL + '/api',
    prepareHeaders: (headers, { getState }) => {
        const token = (getState() as RootState).auth.accessToken;
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
                    body: { refreshToken: (api.getState() as RootState).auth.refreshToken },
                },
                api,
                extraOptions
            );

            if (refreshResult.data) {
                api.dispatch(setCredentials({
                    accessToken: refreshResult.data.accessToken,
                    refreshToken: refreshResult.data.refreshToken,
                    user: refreshResult.data.user || null,
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
} = api;