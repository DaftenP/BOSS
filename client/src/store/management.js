import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from 'axios'
import { generateManagementData } from "../utils/managementDummy";

export const fetchMembers = createAsyncThunk('management/fetchMembers', async () => {
  const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/member/check/1234`);
  const data = Array.isArray(response.data) ? response.data : [response.data];
  return data;
});

export const memberRegistration = createAsyncThunk('management/memberRegistration', async () => {
  const response = await axios.post(`${process.env.REACT_APP_API_URL}/api/member/regist`);
  return response.data
})

const initialManagementState = {
  // data: generateManagementData(60)
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
        state.data = action.payload;
      })
      .addCase(fetchMembers.rejected, (state, action) => {
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
      });
  },
});

// const managementSlice = createSlice({
//   name: 'management',
//   initialState: initialManagementState,
//   reducers: {
//     addManagementData(state, action) {
//       state.data.push(...action.payload);
//     }
//   }
// });

export const managementActions = managementSlice.actions;
export default managementSlice.reducer;
