import type { BaseQueryFn } from "@reduxjs/toolkit/query";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import {
  userLoggedIn,
  userLoggedOut,
  userRefereshToken,
} from "../auth/authSlice";

const baseQuery = fetchBaseQuery({
  baseUrl: process.env.API_URL,
  credentials: "include" as const, // Include cookies
  prepareHeaders: (headers, { getState }) => {
    const token = (getState() as any).auth.accessToken;

    if (token) {
      headers.set("Authorization", `Bearer ${token}`);
    }

    headers.set("Content-Type", "application/json");
    return headers;
  },
});

// Enhanced base query with automatic token refresh
const baseQueryWithReauth: BaseQueryFn = async (args, api, extraOptions) => {
  let result = await baseQuery(args, api, extraOptions);

  if (result?.error?.status === 401) {
    console.log("Access token expired, attempting refresh...");

    const refreshResult = await baseQuery(
      {
        url: "/auth/refresh-token",
        method: "GET",
      },
      api,
      extraOptions,
    );

    if (refreshResult?.data) {
      const refreshData = refreshResult.data as any;

      api.dispatch(userRefereshToken(refreshData.tokens.accessToken));

      console.log("Token refreshed successfully");

      result = await baseQuery(args, api, extraOptions);
    } else {
      // Refresh failed - logout user
      console.log("Token refresh failed - logging out");
      api.dispatch(userLoggedOut());

      // Redirect to login page
      window.location.href = "/login";
    }
  }

  return result;
};

export const apiSlice = createApi({
  reducerPath: "api",
  baseQuery: baseQueryWithReauth,
  tagTypes: ["User", "Product", "Order", "Category"],
  endpoints: (builder) => ({}),
});

export const {} = apiSlice;
