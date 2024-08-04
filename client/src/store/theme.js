import { createSlice } from "@reduxjs/toolkit";

const themeSlice = createSlice({
  name: 'theme',
  initialState: {
    isDarkMode: false,
  },
  reducers: {
    toggleDarkMode: (state) => {
      state.isDarkMode = !state.isDarkMode;
    },
    setDarkMode: (state, action) => {
      state.isDarkMode = action.payload;
    },
  },
});
    
export const { toggleDarkMode, setDarkMode } = themeSlice.actions;

export default themeSlice.reducer;