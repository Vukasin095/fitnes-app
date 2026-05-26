import { apiSlice } from './apiSlice';

export const usersApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation({
      query: (data) => ({ url: '/api/users/login', method: 'POST', body: data }),
    }),
    register: builder.mutation({
      query: (data) => ({ url: '/api/users', method: 'POST', body: data }),
    }),
    logout: builder.mutation({
      query: () => ({ url: '/api/users/logout', method: 'POST' }),
    }),
    // DODAJ OVO ISPOD:
    profile: builder.mutation({
      query: (data) => ({
        url: '/api/users/profile',
        method: 'PUT',
        body: data,
      }),
    }),
  }),
});

export const {
  useLoginMutation,
  useLogoutMutation,
  useRegisterMutation,
  useProfileMutation, // Sada će ovo raditi!
} = usersApiSlice;