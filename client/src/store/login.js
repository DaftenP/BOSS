import { createSlice } from '@reduxjs/toolkit';

const initialLoginState = {
  isLogin: false,
  adminName: '', // 관리자 이름
  loginTime: null, // 로그인 시간
};

const loginSlice = createSlice({
  name: 'login',
  initialState: initialLoginState,
  reducers: {
    login(state, action) {
      console.log('Login action payload:', action.payload);
      state.isLogin = true;
      state.adminName = action.payload?.name || 'Unknown Admin'; // 기본값 추가
      state.loginTime = new Date().toISOString();
    },
    logout(state) {
      state.isLogin = false;
      state.adminName = '';
      state.loginTime = null;
    },
  },
});

export const loginAction = loginSlice.actions;

export default loginSlice.reducer;
