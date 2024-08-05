import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import axios from 'axios'

export const fetchAdminLogs = createAsyncThunk('admin/fetchAdminLogs', async () => {
  const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/admin/log`);
  console.log('관리자 데이터', response.data)
  return response.data.length ? response.data : [];
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