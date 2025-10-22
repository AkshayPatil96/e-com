/* eslint-disable @typescript-eslint/no-explicit-any */
import { apiSlice } from "@/redux/api/apiSlice";

export const userApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getUserByIdAdmin: builder.query<any, string | undefined>({
      query: (id) => ({
        url: `/admin/users/${id}`,
        method: "GET",
        credentials: "include" as const,
      }),
      providesTags: (result, error, id) => [{ type: "User", id }],
    }),
  }),
});

export const { useGetUserByIdAdminQuery } = userApi;
