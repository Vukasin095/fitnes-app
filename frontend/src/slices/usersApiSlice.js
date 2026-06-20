import { USERS_URL } from "../constants";
import { apiSlice } from "./apiSlice";

export const usersApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        login: builder.mutation({
            query: (data) => ({
                url: USERS_URL + '/login',
                method: 'POST',
                body: data,
            }),
        }),
        register: builder.mutation({
            query: (data) => ({
                url: USERS_URL,
                method: 'POST',
                body: data,
            }),
        }),
        logout: builder.mutation({
            query: () => ({
                url: USERS_URL + '/logout',
                method: 'POST',
            }),
        }),
        profile: builder.mutation({
            query: (data) => ({
                url: USERS_URL + '/profile',
                method: 'PUT',
                body: data,
            }),
        }),
        getProfile: builder.query({
            query: () => ({
                url: USERS_URL + '/profile',
                method: 'GET',
            }),
        }),
        createUser: builder.mutation({
            query: (data) => ({
                url: USERS_URL + '/create',
                method: 'POST',
                body: data,
            }),
            invalidatesTags: ['Users'],
        }),
        getUsers: builder.query({
            query: () => ({
                url: USERS_URL,
                method: 'GET',
            }),
            providesTags: ['Users'],
        }),
        deleteUser: builder.mutation({
            query: (id) => ({
                url: USERS_URL + `/${id}`,
                method: 'DELETE',
            }),
            invalidatesTags: ['Users'],
        }),
        getUserById: builder.query({
            query: (id) => ({
                url: USERS_URL + `/${id}`,
                method: 'GET',
            }),
        }),
        updateUser: builder.mutation({
            query: ({ id, ...data }) => ({
                url: USERS_URL + `/${id}`,
                method: 'PUT',
                body: data,
            }),
            invalidatesTags: ['Users'],
        }),
    })
});

export const {
    useLoginMutation,
    useLogoutMutation,
    useRegisterMutation,
    useProfileMutation,
    useGetProfileQuery,
    useGetUsersQuery,
    useDeleteUserMutation,
    useGetUserByIdQuery,
    useUpdateUserMutation,
    useCreateUserMutation,
} = usersApiSlice;
