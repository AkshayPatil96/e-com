/* eslint-disable @typescript-eslint/no-explicit-any */
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

type ReturnData = {
  success: boolean;
  data: any;
  tokens: {
    accessToken: string;
    refreshToken: string;
    tokenType: string;
    expiresIn: number;
  };
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

    activation: builder.mutation<
      ReturnData,
      { activationCode: string; activationToken: string }
    >({
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
              accessToken: result.data.tokens.accessToken,
              user: result.data.data,
            }),
          );
        } catch (error: any) {
          console.log("error: ", error);
        }
      },
    }),

    login: builder.mutation<ReturnData, { email: string; password: string }>({
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
              accessToken: result.data.tokens.accessToken,
              user: result.data.data,
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

    logout: builder.mutation<void, void>({
      query: () => ({
        url: "/auth/logout",
        method: "POST",
      }),
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled;
          dispatch(userLoggedOut());
        } catch (error: any) {
          console.log("error: ", error);
          dispatch(userLoggedOut());
        }
      },
    }),

    refreshToken: builder.mutation<{ tokens: { accessToken: string } }, void>({
      query: () => ({
        url: "/auth/refresh-token",
        method: "GET",
      }),
    }),

    resendActivation: builder.mutation<
      { success: boolean; message: string; activationToken: string },
      { email: string }
    >({
      query: (email) => ({
        url: "/auth/resend-activation",
        method: "POST",
        body: { email },
        credentials: "include" as const,
      }),
    }),
  }),
});

export const {
  useRegisterMutation,
  useActivationMutation,
  useLoginMutation,
  useForgotPasswordMutation,
  useResetPasswordMutation,
  useLogoutMutation,
  useRefreshTokenMutation,
  useResendActivationMutation,
} = authApi;
