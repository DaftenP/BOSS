import { createSlice } from '@reduxjs/toolkit';

const initialLoginState = {
  isLogin: false,
  adminName: '', // 관리자 이름
  loginTime: null, // 로그인 시간
  success: null,
  data: [
    {'admin_name': 'Admin1', 'admin_login_id': 'admin1', 'admin_pw': 'password1'},
    {'admin_name': 'Admin2', 'admin_login_id': 'admin2', 'admin_pw': 'password2'},
    {'admin_name': 'Admin3', 'admin_login_id': 'admin3', 'admin_pw': 'password3'},
    {'admin_name': 'Admin4', 'admin_login_id': 'admin4', 'admin_pw': 'password4'},
    {'admin_name': 'Admin5', 'admin_login_id': 'admin5', 'admin_pw': 'password5'},
    {'admin_name': 'Admin6', 'admin_login_id': 'admin6', 'admin_pw': 'password6'},
    {'admin_name': 'Admin7', 'admin_login_id': 'admin7', 'admin_pw': 'password7'},
  ]
};

const loginSlice = createSlice({
  name: 'login',
  initialState: initialLoginState,
  reducers: {
    login(state, action) {
      const { id, password } = action.payload;
      const admin = state.data.find(admin => admin.admin_login_id === id && admin.admin_pw === password);
      
      if (admin) {
        state.isLogin = true;
        state.success = true;
        state.adminName = admin.admin_name;
        state.loginTime = new Date().toISOString();
      } else {
        state.isLogin = false;
        state.success = false;
        state.adminName = '';
        state.loginTime = null;
      }
    },
    logout(state) {
      state.isLogin = false;
      state.adminName = '';
      state.loginTime = null;
      state.success = null
    },
  },
});

export const loginAction = loginSlice.actions;

export default loginSlice.reducer;
