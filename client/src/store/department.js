import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../utils/api';

// 전체 부서 목록 조회 요청
export const fetchDepartmentLists = createAsyncThunk('department/fetchDepartmentList', async () => {
  const response = await api.get('/api/department/view');
  console.log('전체부서', response.data)
  return response.data.length ? response.data : [];
});

// 부서 등록 요청
export const departmentRegistration = createAsyncThunk('department/departmentRegistration', async (data) => {
  console.log('부서등록요청', data)
  const response = await api.post('/api/department/regist', data);
  console.log('부서등록', response.data)
  return response.data.length ? response.data : [];
});

const initialLoglistState = {
  data: [],
  status: 'idle',
  error: null,
};

const departmentSlice = createSlice({
  name: 'department',
  initialState: initialLoglistState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchDepartmentLists.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchDepartmentLists.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.data = action.payload;
      })
      .addCase(fetchDepartmentLists.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })
      .addCase(departmentRegistration.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(departmentRegistration.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.data = action.payload;
      })
      .addCase(departmentRegistration.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      });
  },
});

export const departmentActions = departmentSlice.actions;
export default departmentSlice.reducer;
