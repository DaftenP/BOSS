import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../utils/api';

// 전체 로그 조회 요청
export const fetchLogs = createAsyncThunk('loglist/fetchLogs', async () => {
  const response = await api.get('/api/log/view');
  console.log('전체', response.data)
  return response.data.length ? response.data : [];
});


// 특정 로그 수정 요청
export const updateLog = createAsyncThunk('loglist/updateLog', async (formData) => {
  const { logId, ...updateData } = formData
  console.log('수정 보낸 것', updateData)
  const response = await api.put(`/api/log/update/${logId}`, updateData)
  console.log('수정 받은 것', response.data)
  return response.data.length ? response.data : [];
})

// 로그 필터링 요청
export const fetchFilteredLogs = createAsyncThunk('loglist/fetchFilteredLogs', async (filters) => {
  console.log('필터링 보낸 것', filters)
  const response = await api.get('/api/log/search', {
    params: filters,
  });
  console.log('필터링 받은 것', response.data)
  return response.data.length ? response.data : [];
});

const initialLoglistState = {
  data: [],
  status: 'idle',
  error: null,
};

const loglistSlice = createSlice({
  name: 'loglist',
  initialState: initialLoglistState,
  reducers: {
    addLogs(state, action) {
      state.data.push(...action.payload);
    },
    updateLogInState(state, action) {
      const updatedLog = action.payload;
      const existingLog = state.data.find(log => log.logId === updatedLog.logId);
      if (existingLog) {
        existingLog.issue = updatedLog.issue;
        existingLog.stickerCount = updatedLog.stickerCount;
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchLogs.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchLogs.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.data = action.payload;
      })
      .addCase(fetchLogs.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })
      .addCase(updateLog.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(updateLog.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.data = state.data.map(log => log.logId === action.payload.logId ? action.payload : log);
        console.log('업데이트된 데이터:', state.data)
      })
      .addCase(updateLog.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })
      .addCase(fetchFilteredLogs.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchFilteredLogs.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.data = action.payload;
      })
      .addCase(fetchFilteredLogs.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      });
  },
});

export const loglistActions = loglistSlice.actions;
export default loglistSlice.reducer;
