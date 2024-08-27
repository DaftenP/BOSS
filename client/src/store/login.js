import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../utils/api';
import { setAccessToken, setRefreshToken, getAccessToken, getRefreshToken, removeAccessToken, removeRefreshToken } from '../utils/token';

export const login = createAsyncThunk('login/login', async (adminInfo) => {
  const response = await api.post('/api/admin/sign-in', adminInfo);

  const accessToken = response.data.accessToken;
  const refreshToken = response.data.refreshToken;

  setAccessToken(accessToken);
  setRefreshToken(refreshToken);
  
  return response.data
});

export const checkAuth = createAsyncThunk('auth/checkAuth', async () => {
  const accessToken = getAccessToken();
  const refreshToken = getRefreshToken();

  if (accessToken && refreshToken) {
    return { accessToken, refreshToken };
  }

  return null;
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
  reducers: {
    logout(state) {
      removeAccessToken();
      removeRefreshToken();
      state.isLogin = false;
      state.success = null;
      state.adminName = '';
      state.loginTime = null;
      state.error = null;

      localStorage.removeItem('loginTime')
    }
  },
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

        localStorage.setItem('loginTime', state.loginTime)
      })
      .addCase(login.rejected, (state, action) => {
        state.isLogin = false;
        state.success = false;
        state.adminName = '';
        state.loginTime = null;
        state.error = action.error.message;
      })
      .addCase(checkAuth.fulfilled, (state, action) => {
        if (action.payload) {
          state.isLogin = true;
          state.loginTime = new Date().toISOString();

          const saveLoginTime = localStorage.getItem('loginTime');
          if (saveLoginTime) {
            state.loginTime = saveLoginTime;
          } else {
            state.loginTime = new Date().toISOString();
            localStorage.setItem('loginTime', state.loginTime)
          }
        } else {
          state.isLogin = false;
          state.adminName = '';
          state.loginTime = null;
        }
      })
      .addCase(checkAuth.rejected, (state) => {
        state.isLogin = false;
        state.adminName = '';
        state.loginTime = null;
      });
  },
});

export const { logout } = loginSlice.actions;

export default loginSlice.reducer;
