import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

export const login = createAsyncThunk('login/login', async ({ adminId, adminPw }) => {
  const response = await axios.post(`${process.env.REACT_APP_API_URL}/api/admin/login`, { adminId, adminPw });
  return response.data;
});

export const logout = createAsyncThunk('login/logout', async () => {
  const response = await axios.post(`${process.env.REACT_APP_API_URL}/api/admin/logout`);
  return response.data;
});

const initialLoginState = {
  isLogin: false,
  adminName: '', // 관리자 이름
  loginTime: null, // 로그인 시간
  success: null,
  error: null,
};

const loginSlice = createSlice({
  name: 'login',
  initialState: initialLoginState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.isLogin = true;
        state.success = true;
        state.adminName = action.payload.adminName;
        state.loginTime = new Date().toISOString();
        state.error = null;
      })
      .addCase(login.rejected, (state, action) => {
        state.isLogin = false;
        state.success = false;
        state.adminName = '';
        state.loginTime = null;
        state.error = action.error.message;
      })
      .addCase(logout.pending, (state) => {
        state.error = null;
      })
      .addCase(logout.fulfilled, (state) => {
        state.isLogin = false;
        state.success = null;
        state.adminName = '';
        state.loginTime = null;
        state.error = null;
      })
      .addCase(logout.rejected, (state, action) => {
        state.error = action.error.message;
      });
  },
});

export default loginSlice.reducer;
