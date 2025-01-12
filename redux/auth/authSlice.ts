import { PayloadAction, createSlice } from "@reduxjs/toolkit";

interface IRegisterData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

interface IAuthState {
  token: string;
  user: any;
  page: string;
  register: IRegisterData;
}

const initialState: IAuthState = {
  token: "",
  user: null,
  page: "",
  register: { firstName: "", lastName: "", email: "", password: "" },
};

type IUserRegistration = { token: string; register: IRegisterData };

type IUserRefresh = { accessToken: string };
type IUserLoggedIn = { accessToken?: string; user: any };

type IUserLoggedOut = {};

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
      state.page = "";
      state.register = { firstName: "", lastName: "", email: "", password: "" };
    },
    userLoggedOut: (state, action: PayloadAction<IUserLoggedOut>) => {
      state.token = "";
      state.user = "";
      state.page = "";
      state.register = { firstName: "", lastName: "", email: "", password: "" };
    },
  },
});

export const {
  userRegistration,
  userLoggedIn,
  userLoggedOut,
  userRefereshToken,
} = authSlice.actions;

export default authSlice.reducer;
