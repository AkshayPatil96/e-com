/* eslint-disable @typescript-eslint/no-explicit-any */
import { apiSlice } from "../api/apiSlice";
import { setLoading, userLoggedIn } from "../auth/authSlice";

export const userApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    loadUser: builder.query<any, void>({
      query: () => ({
        url: "/user/profile",
      }),
      providesTags: ["User"],
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        dispatch(setLoading(true));
        try {
          const result = await queryFulfilled;
          dispatch(
            userLoggedIn({
              user: result.data.data,
            }),
          );
        } catch (error: any) {
          console.log("error: ", error);
        } finally {
          dispatch(setLoading(false));
        }
      },
    }),

    updateUser: builder.mutation<any, Partial<any>>({
      query: (data) => ({
        url: "/user/profile",
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["User"],
    }),
  }),
});

export const { useLoadUserQuery, useUpdateUserMutation } = userApi;
