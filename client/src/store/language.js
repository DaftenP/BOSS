import { createSlice } from "@reduxjs/toolkit";

const languageSlice = createSlice({
  name: 'language',
  initialState: {
    isEnglish: false,
  },
  reducers: {
    toggleEnglish: (state) => {
      state.isEnglish = !state.isEnglish;
    },
  },
});
    
export const { toggleEnglish } = languageSlice.actions;

export default languageSlice.reducer;