import { createSlice } from "@reduxjs/toolkit";
import { loglistDummy } from "../utils/loglistDummy";

const initialLoglistState = {
  data: loglistDummy(8000)
};

const loglistSlice = createSlice({
  name: 'loglist',
  initialState: initialLoglistState,
  reducers: {
    addLogs(state, action) {
      state.data.push(...action.payload);
    }
  }
});

export const loglistActions = loglistSlice.actions;
export default loglistSlice.reducer;
