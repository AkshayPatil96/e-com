"use client";

import { combineReducers, configureStore } from "@reduxjs/toolkit";
import adminSettingSlice from "./adminDashboard/adminSettingSlice";
import { apiSlice } from "./api/apiSlice";
import authSlice, { setLoading } from "./auth/authSlice";
import categorySlice from "./category/categorySlice";
import { userApi } from "./user/userApi";

const reducer = combineReducers({
  [apiSlice.reducerPath]: apiSlice.reducer,
  auth: authSlice,
  category: categorySlice,
  adminSettings: adminSettingSlice,
});

export const store = configureStore({
  reducer,
  devTools: true,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(apiSlice.middleware),
});

// call refresh token endpoint on app load
const initializeApp = async () => {
  // await store.dispatch(
  //   apiSlice.endpoints.refreshToken.initiate({}, { forceRefetch: true }),
  // );
  store.dispatch(setLoading(true));
  try {
    await store.dispatch(
      userApi.endpoints.loadUser.initiate(undefined, { forceRefetch: true }),
    );
  } catch (error) {
    console.log("store error: ", error);
  } finally {
    store.dispatch(setLoading(false));
  }
};

// Export store types
export type AppStore = typeof store;
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

initializeApp();
