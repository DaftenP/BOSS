import { createSlice } from '@reduxjs/toolkit';

const initialNavigationState = {
  activePage: '',
};

const navigationSlice = createSlice({
  name: 'navigation',
  initialState: initialNavigationState,
  reducers: {
    setActivePage(state, action) {
      state.activePage = action.payload;
    },
  },
});

export const navigationActions = navigationSlice.actions;

export default navigationSlice.reducer;
