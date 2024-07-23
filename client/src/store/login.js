import { createSlice } from '@reduxjs/toolkit';

const initialLoginState = {
  isLogin: false,
};

const loginSlice = createSlice({
  name: 'login',
  initialState: initialLoginState,
  reducers: {
    login(state) {
      state.isLogin = true;
    },
    logout(state) {
      state.isLogin = false;
    },
  },
});

export const loginAction = loginSlice.actions;

export default loginSlice.reducer;
