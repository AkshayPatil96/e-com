import { PayloadAction, createSlice } from "@reduxjs/toolkit";

interface IInitialState {
  sidebar: boolean;
}

const initialState: IInitialState = {
  sidebar: false,
};

const adminSettingSlice = createSlice({
  name: "category",
  initialState,
  reducers: {
    switchSidebar: (state, action: PayloadAction<boolean>) => {
      state.sidebar = action.payload;
    },
  },
});

export const { switchSidebar } = adminSettingSlice.actions;

export default adminSettingSlice.reducer;
