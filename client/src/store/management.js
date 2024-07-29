import { createSlice } from "@reduxjs/toolkit";
import { generateManagementData } from "../utils/managementDummy";

const initialManagementState = {
  data: generateManagementData(60)
};

const managementSlice = createSlice({
  name: 'management',
  initialState: initialManagementState,
  reducers: {
    addManagementData(state, action) {
      state.data.push(...action.payload);
    }
  }
});

export const managementActions = managementSlice.actions;
export default managementSlice.reducer;
