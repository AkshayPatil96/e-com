import { apiSlice } from "../api/apiSlice";
import { userLoggedIn, userLoggedOut, userRegistration } from "./authSlice";

type RegistrationResponse = {
  message: string;
  activationToken: string;
};

type RegistrationData = {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
};

export const authApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    register: builder.mutation<RegistrationResponse, RegistrationData>({
      query: (data) => ({
        url: "/auth/register",
        method: "POST",
        body: data,
        credentials: "include" as const,
      }),
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          const result = await queryFulfilled;
          dispatch(
            userRegistration({
              token: result.data.activationToken,
              register: arg,
            }),
          );
        } catch (error: any) {
          console.log("error: ", error);
        }
      },
    }),
    activation: builder.mutation({
      query: ({ activationCode, activationToken }) => ({
        url: "/auth/activate-user",
        method: "POST",
        body: { activationCode, activationToken },
        credentials: "include" as const,
      }),
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          const result = await queryFulfilled;
          dispatch(
            userLoggedIn({
              accessToken: result.data.accessToken,
              user: result.data.user,
            }),
          );
        } catch (error: any) {
          console.log("error: ", error);
        }
      },
    }),
    login: builder.mutation({
      query: ({ email, password }) => ({
        url: "/auth/login",
        method: "POST",
        body: { email, password },
        credentials: "include" as const,
      }),
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          const result = await queryFulfilled;
          dispatch(
            userLoggedIn({
              accessToken: result.data.accessToken,
              user: result.data.data,
            }),
          );
        } catch (error: any) {
          console.log("error: ", error);
        }
      },
    }),
    socialAuth: builder.mutation({
      query: ({ email, name, avatar }) => ({
        url: "/auth/social-auth",
        method: "POST",
        body: { email, name, avatar },
        credentials: "include" as const,
      }),
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          const result = await queryFulfilled;
          dispatch(
            userLoggedIn({
              accessToken: result.data.accessToken,
              user: result.data.user,
            }),
          );
        } catch (error: any) {
          console.log("error: ", error);
        }
      },
    }),
    forgotPassword: builder.mutation({
      query: ({ email }) => ({
        url: "/auth/forget-password",
        method: "POST",
        body: { email },
        credentials: "include" as const,
      }),
    }),
    resetPassword: builder.mutation({
      query: ({ password, confirmPassword, token }) => ({
        url: `/auth/reset-password/${token}`,
        method: "POST",
        body: { password, confirmPassword },
        credentials: "include" as const,
      }),
    }),
    logout: builder.mutation({
      query: () => ({
        url: "/auth/logout",
        method: "POST",
        credentials: "include" as const,
      }),
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled;
          dispatch(userLoggedOut({}));
        } catch (error: any) {
          console.log("error: ", error);
        }
      },
    }),
  }),

  // @ts-ignore
  overrideExisting: true,
});

export const {
  useRegisterMutation,
  useActivationMutation,
  useLoginMutation,
  useSocialAuthMutation,
  useForgotPasswordMutation,
  useResetPasswordMutation,
  useLogoutMutation,
} = authApi;
