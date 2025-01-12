import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { userLoggedIn, userRefereshToken } from "../auth/authSlice";

export const apiSlice = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.API_URL,
  }),
  endpoints: (builder) => ({
    refreshToken: builder.query({
      query: () => ({
        url: "/auth/refresh-token",
        method: "GET",
        credentials: "include" as const,
      }),
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          const result = await queryFulfilled;
          dispatch(
            userRefereshToken({
              accessToken: result.data.accessToken,
            }),
          );
        } catch (error: any) {}
      },
    }),

    loadUser: builder.query({
      query: () => ({
        url: "/user/me",
        method: "GET",
        credentials: "include" as const,
      }),
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          const result = await queryFulfilled;
          dispatch(
            userLoggedIn({
              user: result.data.data,
            }),
          );
        } catch (error: any) {}
      },
    }),
  }),
});

export const { useRefreshTokenQuery, useLoadUserQuery } = apiSlice;
