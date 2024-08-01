import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { loglistDummy } from "../utils/loglistDummy";

// 전체 로그 조회 요청
export const fetchLogs = createAsyncThunk('loglist/fetchLogs', async () => {
  const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/log/view`);
  return response.data;
});


// 특정 로그 수정 요청
export const updateLog = createAsyncThunk('loglist/updateLog', async (formData) => {
  const { logId, ...updateData } = formData
  console.log(updateData)
  const response = await axios.put(`${process.env.REACT_APP_API_URL}/api/log/update/${logId}`, updateData)
  return response.data;
})

// 로그 필터링 요청
// export const fetchFilteredLogs = createAsyncThunk('loglist/fetchFilteredLogs', async () => {
//   const response = await axios.get()
// })

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
        state.data = action.payload;
      })
      .addCase(updateLog.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })
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
