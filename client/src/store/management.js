import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from 'axios'
import { generateManagementData } from "../utils/managementDummy";

// 멤버 데이터 불러오기
export const fetchMembers = createAsyncThunk('management/fetchMembers', async () => {
  const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/member/check`);
  const data = Array.isArray(response.data) ? response.data : [response.data];
  console.log('전체데이터', data)
  return data;
});

// 멤버 등록하기
export const memberRegistration = createAsyncThunk('management/memberRegistration', async (submitData) => {
  console.log('등록 보낸 것', submitData)
  const response = await axios.post(`${process.env.REACT_APP_API_URL}/api/member/regist`, submitData);
  console.log('등록 받은 것', response.data)
  return response.data
})

// 멤버 필터링
export const fetchFilteredMember = createAsyncThunk('management/fetchFilteredMember', async (filters) => {
  console.log('필터 보낸 것', filters)
  const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/member/search`, {
    params: filters,
  });
  console.log('필터 받은 것', response.data)
  return response.data.length ? response.data : [];
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
