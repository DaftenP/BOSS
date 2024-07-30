import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
// import { loglistDummy } from "../utils/loglistDummy";

export const fetchLogs = createAsyncThunk('loglist/fetchLogs', async () => {
  const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/log`);
  return response.data;
});

const initialLoglistState = {
  // data: loglistDummy(8000),
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
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchLogs.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchLogs.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.data = action.payload;
        console.log('Fetched logs:', action.payload); // 로그 추가
      })
      .addCase(fetchLogs.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
        console.error('Fetch logs failed:', action.error.message); // 로그 추가
      });
  },
});

// const loglistSlice = createSlice({
//   name: 'loglist',
//   initialState: initialLoglistState,
//   reducers: {
//     addLogs(state, action) {
//       state.data.push(...action.payload);
//     }
//   }
// });


export const loglistActions = loglistSlice.actions;
export default loglistSlice.reducer;
