/* eslint-disable @typescript-eslint/no-explicit-any */
import { PayloadAction, createSlice } from "@reduxjs/toolkit";

interface IRegisterData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

interface IAuthState {
  token: string;
  user: any | null;
  page: string;
  register: IRegisterData;
  isAuthenticated: boolean;
  isLoading: boolean;
}

const initialState: IAuthState = {
  token: "",
  user: null,
  page: "",
  register: { firstName: "", lastName: "", email: "", password: "" },
  isAuthenticated: false,
  isLoading: false,
};

type IUserRegistration = { token: string; register: IRegisterData };

type IUserRefresh = { accessToken: string };
type IUserLoggedIn = { accessToken?: string; user: any };

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    userRegistration: (state, action: PayloadAction<IUserRegistration>) => {
      state.token = action.payload.token;
      state.register = action.payload.register;
      state.page = "verify";
    },
    userRefereshToken: (state, action: PayloadAction<IUserRefresh>) => {
      state.token = action.payload.accessToken;
      state.page = "";
      state.register = { firstName: "", lastName: "", email: "", password: "" };
    },
    userLoggedIn: (state, action: PayloadAction<IUserLoggedIn>) => {
      state.user = action.payload.user;
      state.isAuthenticated = true;
      state.isLoading = false;
      state.page = "";
      state.register = { firstName: "", lastName: "", email: "", password: "" };
    },
    userLoggedOut: (state, action: PayloadAction) => {
      state.token = "";
      state.user = "";
      state.page = "";
      state.register = { firstName: "", lastName: "", email: "", password: "" };
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
  },
});

export const {
  userRegistration,
  userLoggedIn,
  userLoggedOut,
  userRefereshToken,
  setLoading,
} = authSlice.actions;

export default authSlice.reducer;

export const selectCurrentUser = (state: { auth: IAuthState }) =>
  state.auth.user;
export const selectAccessToken = (state: { auth: IAuthState }) =>
  state.auth.token;
export const selectIsAuthenticated = (state: { auth: IAuthState }) =>
  state.auth.isAuthenticated;
