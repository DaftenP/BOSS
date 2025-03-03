import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from '../utils/api';

// 멤버 데이터 불러오기
export const fetchMembers = createAsyncThunk('management/fetchMembers', async () => {
  const response = await api.get('/api/member/check');
  const data = Array.isArray(response.data) ? response.data : [response.data];
  return data;
});

// 멤버 ID, PW 데이터 불러오기
export const fetchMembersPw = createAsyncThunk('management/fetchMembersPw', async () => {
  const response = await api.get('/api/member/find');
  const data = Array.isArray(response.data) ? response.data : [response.data];
  return data;
});

// 멤버 등록하기
export const memberRegistration = createAsyncThunk('management/memberRegistration', async (formData) => {
  const response = await api.post('/api/member/regist', formData);
  return response.data
})

// 멤버 필터링
export const fetchFilteredMember = createAsyncThunk('management/fetchFilteredMember', async (filters) => {
  const response = await api.get('/api/member/search', {
    params: filters,
  });
  return response.data.length ? response.data : [];
})

const initialManagementState = {
  data: [],
  status: 'idle',
  error: null,
};

const managementSlice = createSlice({
  name: 'management',
  initialState: initialManagementState,
  reducers: {
    addLogs(state, action) {
      state.data.push(...action.payload);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchMembers.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchMembers.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.data  = action.payload;
      })
      .addCase(fetchMembers.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })
      .addCase(fetchMembersPw.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchMembersPw.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.membersPw  = action.payload;
      })
      .addCase(fetchMembersPw.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })
      .addCase(memberRegistration.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(memberRegistration.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.data.push(action.payload);
      })
      .addCase(memberRegistration.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })
      .addCase(fetchFilteredMember.pending, (state) => {
        state.status = 'loading'
      })
      .addCase(fetchFilteredMember.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.data = action.payload;
      })
      .addCase(fetchFilteredMember.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      });
  },
});

export const managementActions = managementSlice.actions;
export default managementSlice.reducer;
