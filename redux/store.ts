"use client";
import { combineReducers, configureStore } from "@reduxjs/toolkit";
import { apiSlice } from "./api/apiSlice";
import authSlice from "./auth/authSlice";
import categorySlice from "./category/categorySlice";
import adminSettingSlice from "./admin/adminSettingSlice";

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
  await store.dispatch(
    apiSlice.endpoints.refreshToken.initiate({}, { forceRefetch: true }),
  );

  await store.dispatch(
    apiSlice.endpoints.loadUser.initiate({}, { forceRefetch: true }),
  );
};

// Export store types
export type AppStore = typeof store;
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

initializeApp();
