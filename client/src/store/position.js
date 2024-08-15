import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../utils/api';

// 전체 직책 목록 조회 요청
export const fetchPositionLists = createAsyncThunk('position/fetchPositionLists', async () => {
  const response = await api.get('/api/position/view');
  return response.data.length ? response.data : [];
});

// 직책 등록 요청
export const positionRegistration = createAsyncThunk('position/positionRegistration', async (data) => {
  const response = await api.post('/api/position/regist', data);
  return response.data.length ? response.data : [];
});

const initialLoglistState = {
  data: [],
  status: 'idle',
  error: null,
};

const positionSlice = createSlice({
  name: 'position',
  initialState: initialLoglistState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchPositionLists.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchPositionLists.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.data = action.payload;
      })
      .addCase(fetchPositionLists.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })
      .addCase(positionRegistration.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(positionRegistration.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.data = action.payload;
      })
      .addCase(positionRegistration.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      });
  },
});

export const positionActions = positionSlice.actions;
export default positionSlice.reducer;
