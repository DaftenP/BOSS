import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import api from '../utils/api';

export const fetchAdminLogs = createAsyncThunk('admin/fetchAdminLogs', async () => {
  const response = await api.get('/api/admin/log/check');
  console.log('관리자 데이터', response.data)
  return response.data.length ? response.data.reverse().slice(0, 10) : [];
});

const initialAdminState = {
  data: [],
  status: 'idle',
  error: null,
}

const adminSlice = createSlice({
  name: 'admin',
  initialState: initialAdminState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAdminLogs.pending, (state) => {
        state.status = 'loading'
      })
      .addCase(fetchAdminLogs.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.data = action.payload;
      })
      .addCase(fetchAdminLogs.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      });
  },
})

export const adminAction = adminSlice.reducer
export default adminSlice.reducer