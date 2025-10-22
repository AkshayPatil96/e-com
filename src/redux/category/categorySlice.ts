import { ICategory } from "@/@types/category.types";
import { PayloadAction, createSlice } from "@reduxjs/toolkit";

interface IInitialCategoryState {
  nestedCategory: ICategory[];
}

interface INestedCategory {
  data: ICategory[];
}

const initialState: IInitialCategoryState = {
  nestedCategory: [],
};

const categorySlice = createSlice({
  name: "category",
  initialState,
  reducers: {
    setNestedCategory: (state, action: PayloadAction<INestedCategory>) => {
      state.nestedCategory = action.payload.data;
    },
  },
});

export const { setNestedCategory } = categorySlice.actions;

export default categorySlice.reducer;
